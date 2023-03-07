// Fill out your copyright notice in the Description page of Project Settings.


#include "Throwable.h"

#include "Components/CapsuleComponent.h"
#include "Kismet/GameplayStatics.h"
#include "Kismet/KismetSystemLibrary.h"
#include "Components/BoxComponent.h"
#include "GameFramework/Character.h"
#include "ThirdPersonTest/ThirdPersonTestCharacter.h"

// Sets default values
AThrowable::AThrowable()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
	
	MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMesh"));
	RootComponent = MeshComp;
	
	MeshComp->SetSimulatePhysics(true);
	MeshComp->CanCharacterStepUp(false);

	MeshComp->SetEnableGravity(true);
	//MeshComp->SetCollisionEnabled(ECollisionEnabled::PhysicsOnly);
	
	//MeshComp->SetCollisionProfileName(FName("OverlapAllDynamic"));
	//MeshComp->SetCollisionResponseToChannel(ECollisionChannel::ECC_EngineTraceChannel5, ECollisionResponse::ECR_Block);

	OverlapComp = CreateDefaultSubobject<UBoxComponent>(TEXT("OverlapComp"));
	OverlapComp->SetBoxExtent(FVector(75,75,50));
	OverlapComp->SetupAttachment(MeshComp);
		
}

void AThrowable::OverlapPickup(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	UE_LOG(LogTemp, Warning, TEXT("OverlapPickup Called"));
	ACharacter* OtherCharacter = Cast<ACharacter>(OtherActor);
	if(IsValid(OtherCharacter))
	{
		PickUp();
	}
}

// Called when the game starts or when spawned
void AThrowable::BeginPlay()
{
	Super::BeginPlay();
	OverlapComp->OnComponentBeginOverlap.AddDynamic(this, &AThrowable::OverlapPickup);
	//PickUp();
}

// Called every frame
void AThrowable::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void AThrowable::PickUp()
{
	UE_LOG(LogTemp, Warning, TEXT("PickUp Called"));

	AThirdPersonTestCharacter* PlayerCharacter = Cast<AThirdPersonTestCharacter>(UGameplayStatics::GetPlayerCharacter(GetWorld(), 0));
	if (IsValid(PlayerCharacter) && PlayerCharacter->Throwable == nullptr)
	{
		MeshComp->SetSimulatePhysics(false);
		MeshComp->SetEnableGravity(false);
		MeshComp->SetCollisionEnabled(ECollisionEnabled::NoCollision);

		MeshComp->AttachToComponent(PlayerCharacter->GetMesh(), FAttachmentTransformRules::SnapToTargetNotIncludingScale, FName("hand_r"));
	
		PlayerCharacter->Throwable = this;
		bIsPickedUp = true;
	}

}


void AThrowable::Throw()
{
	UE_LOG(LogTemp, Warning, TEXT("Throw Called"));
	AThirdPersonTestCharacter* PlayerCharacter = Cast<AThirdPersonTestCharacter>(UGameplayStatics::GetPlayerCharacter(GetWorld(), 0));
	if (IsValid(PlayerCharacter) && PlayerCharacter->Throwable != nullptr)
	{
		MeshComp->DetachFromComponent(FDetachmentTransformRules::KeepWorldTransform);
		MeshComp->SetSimulatePhysics(true);
		MeshComp->SetCollisionEnabled(ECollisionEnabled::QueryAndPhysics);

		FVector ThrowPower = (PlayerCharacter->GetCapsuleComponent()->GetForwardVector() * 80.0f +
			PlayerCharacter->GetCapsuleComponent()->GetUpVector() * 80.0f) * 100.0f;

		MeshComp->AddImpulse(ThrowPower);
		MeshComp->SetEnableGravity(true);
	

		PlayerCharacter->Throwable = nullptr;
		bIsPickedUp = false;
	}
	
}
