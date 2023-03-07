// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Interfaces/DIalogueInterface.h"
#include "NPC.generated.h"

class UBoxComponent;

UCLASS()
class THIRDPERSONTEST_API ANPC : public ACharacter, public IDIalogueInterface
{
	GENERATED_BODY()

public:
	// Sets default values for this character's properties
	ANPC();

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Components")
	UBoxComponent* OverlapComp;

	virtual void Talk_Implementation() override;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	TArray<FString> Dialogues;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
	int32 talkIndex = -1;

	UFUNCTION(BlueprintImplementableEvent, BlueprintCallable)
	void DialoguesText(const FString& dialogueText);

	UFUNCTION(BlueprintImplementableEvent, BlueprintCallable)
	void NoDialoguesLeft();

};
