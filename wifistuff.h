//we will use this for wifi related things
#pragma once
#define CONFIG_WIFI_ACTIVE

#ifdef CONFIG_WIFI_ACTIVE
#include <WiFiManager.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <ArduinoJson.h>
#include <time.h>
#endif 
#include <Arduino.h>
#include "FileOps.h"
#include <string>
#include "coinBank.h"

//create access point if no wifi is available
namespace wifi{
/*
* @brief get the piggybank for exposing POST endpoints which use the piggybank
*
* @param bank a pointer to the piggybank
*
* 
*/
void setPiggyBank(std::vector<coinBank> *bank);
/*
* @brief creates an access point for the piggy bank
*
* lets the user send wifi credentials to the piggy bank
*/
void hostAP(void * pvParameters);

/*
* @brief hosts a server for the piggy bank
*
* provides a RESTful API for basic statistics and control
*/
void hostServer(void * pvParameters);

/*
* @brief gets the current timestamp
*
* @return hh:mm:ss-dd/mm/yyyy
*
* empty string if wifi is not enabled or time cannot be obtained
*/
String getTimestamp();
}
