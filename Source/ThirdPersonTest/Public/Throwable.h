// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Throwable.generated.h"

class UBoxComponent;
class UStaticMeshComponent;

UCLASS()
class THIRDPERSONTEST_API AThrowable : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AThrowable();
	
	UFUNCTION()
	void OverlapPickup(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp,
	                   int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
	
	void PickUp();
	
	void Throw();

	UPROPERTY(EditAnywhere, Category="Components")
	UStaticMeshComponent* MeshComp;

	UPROPERTY(EditAnywhere, Category="Components")
	UBoxComponent* OverlapComp;

	bool bIsPickedUp = false;

};
