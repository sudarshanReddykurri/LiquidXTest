// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "SwitchTrigger.generated.h"

class UBoxComponent;
class UPointLightComponent;

UCLASS()
class THIRDPERSONTEST_API ASwitchTrigger : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	ASwitchTrigger();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	
	UPROPERTY(EditAnywhere, Category = "Light Switch")
	UPointLightComponent* PointLight;
	
	UPROPERTY(EditAnywhere, Category = "Light Switch")
	UBoxComponent* OverlapComp;

	UPROPERTY(VisibleAnywhere, Category = "Light Switch")
	float LightIntensity;
	
	UFUNCTION(BlueprintCallable, Category = "Light Switch")
	void ToggleLight();

	UFUNCTION()
	void OnSwitchOverlapBegin(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp,
					int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

	UFUNCTION()
	void OnSwitchOverlapEnd(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp,
		int32 OtherBodyIndex);
	
public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
	
};
