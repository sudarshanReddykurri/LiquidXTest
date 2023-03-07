// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "TestActor.generated.h"

UCLASS()
class THIRDPERSONTEST_API ATestActor : public AActor
{
	GENERATED_BODY()

private:
	TArray<AActor*> MyActors;
	
public:	
	// Sets default values for this actor's properties
	ATestActor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	void PopulateArray(int n);

	void PrintArray(const TArray<AActor*>& Array);

	UFUNCTION(BlueprintCallable)
	void TestSpawnLogic(int32 InActorCount);

};
