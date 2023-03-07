// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "OpenDoor.generated.h"

class UBoxComponent;
class UTimelineComponent;

UCLASS()
class THIRDPERSONTEST_API AOpenDoor : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AOpenDoor();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	UPROPERTY(VisibleAnywhere, Category="Components")
	UStaticMeshComponent* Door;

	UPROPERTY(VisibleAnywhere, Category="Components")
	UBoxComponent* MyBoxComponent;

	UPROPERTY(EditAnywhere)
	UCurveFloat *OpenCurve;
	
	UFUNCTION()
	void OnOverlapBegin(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
	
	UFUNCTION()
	void OnOverlapEnd(class UPrimitiveComponent* OverlappedComp, class AActor* OtherActor, class UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

	UFUNCTION()
	void ControlDoor(float Value);

	bool bIsOpen;
	
	float RotateValue;
	
	float CurveFloatValue;
	
	FRotator DoorRotation;
	
	UTimelineComponent* MyTimeline;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

};
