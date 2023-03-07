// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"

#include "DIalogueInterface.generated.h"

// This class does not need to be modified.
UINTERFACE(MinimalAPI)
class UDIalogueInterface : public UInterface
{
	GENERATED_BODY()
};

/**
 * 
 */
class THIRDPERSONTEST_API IDIalogueInterface
{
	GENERATED_BODY()

	// Add interface functions to this class. This is the class that will be inherited to implement this interface.
public:
	UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Dialogues")
	void Talk();
};
