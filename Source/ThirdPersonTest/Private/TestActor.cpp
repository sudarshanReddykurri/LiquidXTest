// Fill out your copyright notice in the Description page of Project Settings.


#include "TestActor.h"

// Sets default values
ATestActor::ATestActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

}

// Called when the game starts or when spawned
void ATestActor::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void ATestActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

}

void ATestActor::PopulateArray(int n)
{
	for(int i = 0; i < n; ++i)
	{
		AActor* ActorToAdd = GetWorld()->SpawnActor<AActor>();
		MyActors.Add(ActorToAdd);
	}
}

void ATestActor::PrintArray(const TArray<AActor*>& Array)
{
	for(auto Actor : Array)
	{
		UE_LOG(LogTemp, Warning, TEXT("Actor's name is: %s"),
		*Actor->GetName());
	}
}

void ATestActor::TestSpawnLogic(int32 InActorCount)
{
	PopulateArray(InActorCount);
	PrintArray(MyActors);
}
