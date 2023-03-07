// Copyright Epic Games, Inc. All Rights Reserved.

#include "ThirdPersonTestCharacter.h"
#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/Controller.h"
#include "GameFramework/SpringArmComponent.h"
#include "EnhancedInputComponent.h"
#include "EnhancedInputSubsystems.h"
#include "NiagaraComponent.h"
#include "NiagaraFunctionLibrary.h"


//////////////////////////////////////////////////////////////////////////
// AThirdPersonTestCharacter

AThirdPersonTestCharacter::AThirdPersonTestCharacter()
{
	// Set size for collision capsule
	GetCapsuleComponent()->InitCapsuleSize(42.f, 96.0f);
		
	// Don't rotate when the controller rotates. Let that just affect the camera.
	bUseControllerRotationPitch = false;
	bUseControllerRotationYaw = false;
	bUseControllerRotationRoll = false;

	// Configure character movement
	GetCharacterMovement()->bOrientRotationToMovement = true; // Character moves in the direction of input...	
	GetCharacterMovement()->RotationRate = FRotator(0.0f, 500.0f, 0.0f); // ...at this rotation rate

	// Note: For faster iteration times these variables, and many more, can be tweaked in the Character Blueprint
	// instead of recompiling to adjust them
	GetCharacterMovement()->JumpZVelocity = 700.f;
	GetCharacterMovement()->AirControl = 0.35f;
	GetCharacterMovement()->MaxWalkSpeed = 500.f;
	GetCharacterMovement()->MinAnalogWalkSpeed = 20.f;
	GetCharacterMovement()->BrakingDecelerationWalking = 2000.f;

	// Create a camera boom (pulls in towards the player if there is a collision)
	CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
	CameraBoom->SetupAttachment(RootComponent);
	CameraBoom->TargetArmLength = 400.0f; // The camera follows at this distance behind the character	
	CameraBoom->bUsePawnControlRotation = true; // Rotate the arm based on the controller

	// Create a follow camera
	FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
	FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName); // Attach the camera to the end of the boom and let the boom adjust to match the controller orientation
	FollowCamera->bUsePawnControlRotation = false; // Camera does not rotate relative to arm


	// JetPack Mesh
	MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("JetPackSM"));
	//MeshComp->SetupAttachment(GetMesh());
	MeshComp->AttachToComponent(GetMesh(), FAttachmentTransformRules::SnapToTargetNotIncludingScale, FName("spine_05"));
	
	// Niagara FX
	NiagaraComp = CreateDefaultSubobject<UNiagaraComponent>(TEXT("ParticleEffect"));
	NiagaraComp->SetupAttachment(RootComponent);
	NiagaraComp->SetRelativeLocation(FVector(0.0));
	NiagaraComp->SetTickBehavior(ENiagaraTickBehavior::UsePrereqs);
	NiagaraComp->SetAllowScalability(true);
	NiagaraComp->SetAutoActivate(false);
	NiagaraComp->SetupAttachment(MeshComp);
	//NiagaraComp->SetVisibility(false, false);

	// Note: The skeletal mesh and anim blueprint references on the Mesh component (inherited from Character) 
	// are set in the derived blueprint asset named ThirdPersonCharacter (to avoid direct content references in C++)
}

void AThirdPersonTestCharacter::BeginPlay()
{
	// Call the base class  
	Super::BeginPlay();

	//Add Input Mapping Context
	if (APlayerController* PlayerController = Cast<APlayerController>(Controller))
	{
		if (UEnhancedInputLocalPlayerSubsystem* Subsystem = ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PlayerController->GetLocalPlayer()))
		{
			Subsystem->AddMappingContext(DefaultMappingContext, 0);
		}
	}
}

//////////////////////////////////////////////////////////////////////////
// Input

void AThirdPersonTestCharacter::SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent)
{
	// Set up action bindings
	if (UEnhancedInputComponent* EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent)) {
		
		//Jumping
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Triggered, this, &AThirdPersonTestCharacter::Jump);
		EnhancedInputComponent->BindAction(JumpAction, ETriggerEvent::Completed, this, &AThirdPersonTestCharacter::StopJumping);

		//Moving
		EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AThirdPersonTestCharacter::Move);

		//Looking
		EnhancedInputComponent->BindAction(LookAction, ETriggerEvent::Triggered, this, &AThirdPersonTestCharacter::Look);

		//Throw
		EnhancedInputComponent->BindAction(ThrowAction, ETriggerEvent::Triggered, this, &AThirdPersonTestCharacter::Throw);

		//Interact
		EnhancedInputComponent->BindAction(InteractAction, ETriggerEvent::Started, this, &AThirdPersonTestCharacter::Interact);
	}

}

void AThirdPersonTestCharacter::Jump(const FInputActionValue& Value)
{
	UCharacterMovementComponent* CharMoveComp = GetCharacterMovement();
	bool bIsFalling; 
	if(IsValid((CharMoveComp)))
	{
		bIsFalling = CharMoveComp->IsFalling();

		if(bIsFalling && Fuel > 0.0f)
		{
			CharMoveComp->GravityScale = 0.0f;
			FVector CurrentCharVelocity = CharMoveComp->Velocity;

			// Applying Thrust and SlowDown in the Movement
			FVector UpdatedCharVelocity = FVector((CurrentCharVelocity.X * SlowDown), (CurrentCharVelocity.Y * SlowDown), Thrust);
			CharMoveComp->Velocity = UpdatedCharVelocity;

			bIsHovering = true;

			// Activate Particle Effect
			if(IsValid(NiagaraComp))
			{
				NiagaraComp->Activate();
				NiagaraComp->SetVisibility(true, true);
			}
		}
		else
		{
			ACharacter::Jump();
		}
	}
}

void AThirdPersonTestCharacter::StopJumping(const FInputActionValue& Value)
{
	ACharacter::StopJumping();
	
	DropCharacter();
}

void AThirdPersonTestCharacter::Move(const FInputActionValue& Value)
{
	// input is a Vector2D
	FVector2D MovementVector = Value.Get<FVector2D>();

	if (Controller != nullptr)
	{
		// find out which way is forward
		const FRotator Rotation = Controller->GetControlRotation();
		const FRotator YawRotation(0, Rotation.Yaw, 0);

		// get forward vector
		const FVector ForwardDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
	
		// get right vector 
		const FVector RightDirection = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);

		// add movement 
		AddMovementInput(ForwardDirection, MovementVector.Y);
		AddMovementInput(RightDirection, MovementVector.X);
	}
}

void AThirdPersonTestCharacter::Look(const FInputActionValue& Value)
{
	// input is a Vector2D
	FVector2D LookAxisVector = Value.Get<FVector2D>();

	if (Controller != nullptr)
	{
		// add yaw and pitch input to controller
		AddControllerYawInput(LookAxisVector.X);
		AddControllerPitchInput(LookAxisVector.Y);
	}
}

void AThirdPersonTestCharacter::Throw(const FInputActionValue& Value)
{
	//UE_LOG(LogTemp, Warning, TEXT("Throw Input Called"));
	if (Throwable != nullptr) {
		Throwable->Throw();
	}
}


void AThirdPersonTestCharacter::Interact(const FInputActionValue& Value) {
	UE_LOG(LogTemp, Warning, TEXT("Interact Input Called"));

	TArray<AActor*> overlappingActors;
	GetOverlappingActors(overlappingActors, NPCClass);

	for(AActor* tempActor : overlappingActors)
	{
		UE_LOG(LogTemp, Warning, TEXT("overlappingActors Name %s"), *tempActor->GetName());
		IDIalogueInterface* DialogueInterface = Cast<IDIalogueInterface>(tempActor);
		if (DialogueInterface!=nullptr) {
			// Don't call your functions directly, use the 'Execute_' prefix 
			DialogueInterface->Execute_Talk(tempActor);
		}
		
		/*if (tempActor->GetClass()->ImplementsInterface(UDIalogueInterface::StaticClass())) {
			IDIalogueInterface::Execute_Talk(tempActor);
		}*/
	}
}

void AThirdPersonTestCharacter::ConsumeFuel()
{
	// Amount the fuel needs to be consumed
	const int32 amountFuelConsumed = 0.01f;
	
	Fuel = Fuel - amountFuelConsumed;

	UE_LOG(LogTemp, Warning, TEXT("[AThirdPersonTestCharacter::ConsumeFuel] Current Fuel %f"), Fuel);

	if(Fuel<=0.0f)
	{
		// Drop the character if out of fuel
		DropCharacter();
	}else
	{
		GetWorldTimerManager().SetTimer(FuelTimerHandle,[&](){
			if(bIsHovering)
			{
				ConsumeFuel();
			}
		},0.1f, true);
	}
}

void AThirdPersonTestCharacter::DropCharacter()
{
	UCharacterMovementComponent* CharMoveComp = GetCharacterMovement();
    	if(IsValid((CharMoveComp)))
    	{
    		if(bIsHovering)
    		{
    			// Reset Gravity Scale
    			CharMoveComp->GravityScale = 1.0f;

    			// Turn off consume fuel logic
    			if(FuelTimerHandle.IsValid())
    				GetWorldTimerManager().ClearTimer(FuelTimerHandle);
    			
    			bIsHovering= false;
    			
    			// Deactivate Particle Effect
    			if(IsValid(NiagaraComp))
    			{
    				NiagaraComp->Deactivate();
    				
    				FTimerHandle localTimerHandle;
    				GetWorldTimerManager().SetTimer(localTimerHandle, [&]()
    				{
    					NiagaraComp->SetVisibility(false, true);
    				}, 1.0f, false);
    				
    			}
    		}
    	}
}




