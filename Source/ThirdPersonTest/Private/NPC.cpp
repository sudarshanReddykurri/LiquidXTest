// Fill out your copyright notice in the Description page of Project Settings.


#include "NPC.h"

#include "Components/BoxComponent.h"

// Sets default values
ANPC::ANPC()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	OverlapComp = CreateDefaultSubobject<UBoxComponent>(TEXT("OverlapComp"));
	OverlapComp->SetBoxExtent(FVector(75, 75, 50));
	OverlapComp->SetupAttachment(RootComponent);
	OverlapComp->SetCollisionProfileName(TEXT("OverlapAllDynamic"));
	

}

// Called when the game starts or when spawned
void ANPC::BeginPlay()
{
	Super::BeginPlay();
	
}

// Called every frame
void ANPC::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

// Called to bind functionality to input
void ANPC::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

}

void ANPC::Talk_Implementation()
{
	UE_LOG(LogTemp, Warning, TEXT("Talk_Implementation Called"));
	talkIndex++;
	if(talkIndex < Dialogues.Num())
	{
		UE_LOG(LogTemp, Warning, TEXT("%s"), *Dialogues[talkIndex]);
		DialoguesText(Dialogues[talkIndex]);
	}
	else
	{
		// No more Dialogues left
		NoDialoguesLeft();
	}
	
}


