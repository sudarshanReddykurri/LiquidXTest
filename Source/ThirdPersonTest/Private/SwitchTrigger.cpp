// Fill out your copyright notice in the Description page of Project Settings.


#include "SwitchTrigger.h"
#include "Components/BoxComponent.h"
#include "Components/PointLightComponent.h"
#include "GameFramework/Character.h"

// Sets default values
ASwitchTrigger::ASwitchTrigger()
{
	LightIntensity = 3000.0f;

	PointLight = CreateDefaultSubobject<UPointLightComponent>(TEXT("Point Light"));
	PointLight->Intensity = LightIntensity;
	PointLight->SetVisibility(true);


	OverlapComp = CreateDefaultSubobject<UBoxComponent>(TEXT("OverlapComp"));
	OverlapComp->SetBoxExtent(FVector(75,75,50));
	RootComponent = OverlapComp;
	
	//PointLight->SetupAttachment(SphereComp);
	PointLight->AttachToComponent(OverlapComp, FAttachmentTransformRules::SnapToTargetNotIncludingScale);
}

// Called when the game starts or when spawned
void ASwitchTrigger::BeginPlay()
{
	Super::BeginPlay();
	OverlapComp->OnComponentBeginOverlap.AddDynamic(this, &ASwitchTrigger::OnSwitchOverlapBegin);
	OverlapComp->OnComponentEndOverlap.AddDynamic(this, &ASwitchTrigger::OnSwitchOverlapEnd);
}

// Called every frame
void ASwitchTrigger::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}


void ASwitchTrigger::OnSwitchOverlapBegin(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	UE_LOG(LogTemp, Warning, TEXT("OnOverlapBegin Called"));
	ACharacter* OtherCharacter = Cast<ACharacter>(OtherActor);
	if(IsValid(OtherCharacter))
	{
		ToggleLight();
	}
}

void ASwitchTrigger::OnSwitchOverlapEnd(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor,
	UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
	UE_LOG(LogTemp, Warning, TEXT("OnOverlapEnd Called"));
	ACharacter* OtherCharacter = Cast<ACharacter>(OtherActor);
	if(IsValid(OtherCharacter))
	{
		ToggleLight();
	}
}

void ASwitchTrigger::ToggleLight()
{
	UE_LOG(LogTemp, Warning, TEXT("ToggleLight Called"));
	PointLight->ToggleVisibility();
}

