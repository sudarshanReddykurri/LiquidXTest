// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "InputActionValue.h"
#include "NPC.h"
#include "Throwable.h"
#include "ThirdPersonTestCharacter.generated.h"

class UNiagaraSystem;
class UNiagaraComponent;

UCLASS(config=Game)
class AThirdPersonTestCharacter : public ACharacter
{
	GENERATED_BODY()

	/** Camera boom positioning the camera behind the character */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class USpringArmComponent* CameraBoom;

	/** Follow camera */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class UCameraComponent* FollowCamera;
	
	/** MappingContext */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputMappingContext* DefaultMappingContext;

	/** Jump Input Action */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputAction* JumpAction;

	/** Move Input Action */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputAction* MoveAction;

	/** Look Input Action */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputAction* LookAction;

	/** Throw Action */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputAction* ThrowAction;

	/** Interact Action */
	UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = Input, meta = (AllowPrivateAccess = "true"))
	class UInputAction* InteractAction;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Components, meta = (AllowPrivateAccess = "true"))
	UStaticMeshComponent* MeshComp;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = Components, meta = (AllowPrivateAccess = "true"))
	UNiagaraComponent* NiagaraComp;
	
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite, Category = JetPack, meta = (AllowPrivateAccess = "true"))
	bool bIsHovering = false;

	UPROPERTY(VisibleAnywhere, BlueprintReadWrite, Category = JetPack, meta = (AllowPrivateAccess = "true"))
	float Fuel = 1.0f;

	// Lift amount
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite, Category = JetPack, meta = (AllowPrivateAccess = "true"))
	float Thrust = 250.0f;
	
	// Reducing character movement once jetpack is activated
	UPROPERTY(VisibleAnywhere, BlueprintReadWrite, Category = JetPack, meta = (AllowPrivateAccess = "true"))
	float SlowDown = 0.5f;

	FTimerHandle FuelTimerHandle;

	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "NPC", meta = (AllowPrivateAccess = "true"))
	TSubclassOf<ANPC> NPCClass;

public:
	AThirdPersonTestCharacter();

	bool bIsHoldingThrowable = false;

	AThrowable* Throwable;
	
protected:

	/** Called for movement input */
	void Jump(const FInputActionValue& Value);

	/** Called for movement input */
	void StopJumping(const FInputActionValue& Value);

	/** Called for movement input */
	void Move(const FInputActionValue& Value);

	/** Called for looking input */
	void Look(const FInputActionValue& Value);

	/** Called for Throw input */
	void Throw(const FInputActionValue& Value);

	/** Called for Interact With NPC input */
	void Interact(const FInputActionValue& Value);

	void ConsumeFuel();

	void DropCharacter();
			

protected:
	// APawn interface
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;
	
	// To add mapping context
	virtual void BeginPlay();

public:
	/** Returns CameraBoom subobject **/
	FORCEINLINE class USpringArmComponent* GetCameraBoom() const { return CameraBoom; }
	/** Returns FollowCamera subobject **/
	FORCEINLINE class UCameraComponent* GetFollowCamera() const { return FollowCamera; }
};


