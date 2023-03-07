// Fill out your copyright notice in the Description page of Project Settings.


#include "OpenDoor.h"
#include "Components/BoxComponent.h"
#include "Components/TimelineComponent.h"
#include "Kismet/KismetMathLibrary.h"

// Sets default values
AOpenDoor::AOpenDoor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	bIsOpen = false;

	MyBoxComponent = CreateDefaultSubobject<UBoxComponent>(TEXT("Box Component"));
	MyBoxComponent->InitBoxExtent(FVector(50,50,50));
	RootComponent = MyBoxComponent;

	Door = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Door Mesh"));
	Door->SetRelativeLocation(FVector(0.0f, 50.0f, -50.0f));
	Door->SetupAttachment(RootComponent);

	MyBoxComponent->OnComponentBeginOverlap.AddDynamic(this, &AOpenDoor::OnOverlapBegin);
	MyBoxComponent->OnComponentEndOverlap.AddDynamic(this, &AOpenDoor::OnOverlapEnd);

	RotateValue = 90.0f;
}

// Called when the game starts or when spawned
void AOpenDoor::BeginPlay()
{
	Super::BeginPlay();
	
	if (OpenCurve)
	{
		FOnTimelineFloat TimelineCallback;
		TimelineCallback.BindUFunction(this, FName("ControlDoor"));
		
		MyTimeline = NewObject<UTimelineComponent>(this, FName("DoorAnimTimeline"));
		MyTimeline->AddInterpFloat(OpenCurve, TimelineCallback);
		MyTimeline->RegisterComponent();
	}
}

void AOpenDoor::OnOverlapBegin(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp,
	int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	 if ((OtherActor != nullptr) && (OtherActor != this) && (OtherComp != nullptr) ) 
        {
            FVector CharLocation = OtherActor->GetActorLocation();
            FVector Direction = (GetActorLocation() - CharLocation);

	 		// Used to find the direction in which side to rotate the door
            Direction = GetActorRotation().UnrotateVector(Direction);

	 		UE_LOG(LogTemp, Warning, TEXT("Direction Value: %s"), *(Direction.ToString()));
    
            if(Direction.Y > 0.0f)
            {
                RotateValue = 90.0f;
            }
            else
            {
                RotateValue = -90.0f;
            }
    
            DoorRotation = Door->GetRelativeRotation();
    		bIsOpen = true;
	 	
	 		if (IsValid(MyTimeline))
    		{
    			MyTimeline->PlayFromStart();
    		}
    	}
}

void AOpenDoor::OnOverlapEnd(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp,
	int32 OtherBodyIndex)
{
	if ( (OtherActor != nullptr) && (OtherActor != this) && (OtherComp != nullptr) )  
	{
		DoorRotation = Door->GetRelativeRotation();
		bIsOpen = false;
		
		if (IsValid(MyTimeline))
		{
			MyTimeline->Reverse();
		}
	}
}

void AOpenDoor::ControlDoor(float Value)
{
	CurveFloatValue = RotateValue * Value;
	UE_LOG(LogTemp, Warning, TEXT("Timeline Value: %f"), CurveFloatValue);
	
	FQuat NewRotation = FQuat(FRotator(0.f, CurveFloatValue, 0.f));
	Door->SetRelativeRotation(NewRotation);
}

// Called every frame
void AOpenDoor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

