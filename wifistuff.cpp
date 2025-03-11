#include "wifistuff.h"
#include "FileOps.h"
#include <ArduinoJson.h>
#ifdef CONFIG_WIFI_ACTIVE
WebServer server(80);
#endif
//endpoint handlers
const char* domain = "piggybank";
const char* ssid = "PiggyBank_AP";
const char* password= "0inkMoney!";
bool connected = false;
std::vector<coinBank> *b = nullptr;

//handler function forwared declarations
void handleRoot();
void getBankValues();
void getGameHistory();
void dispenseExactAmount();
void dispenseSpecificDenomination();
void dispenseAll();

void wifi::setPiggyBank(std::vector<coinBank> *bank){
    b = bank;
}

//exposed functions
String wifi::getTimestamp(){
    #ifdef CONFIG_WIFI_ACTIVE
        if (!connected){
            return "";
        }
        struct tm timeinfo;
        if(!getLocalTime(&timeinfo)){
            return "";
        }
        char fmt[64];
        //format
        strftime(fmt,sizeof(fmt),"%H:%M:%S-%d/%m/%Y",&timeinfo);
        return fmt;
    #else
        return "";
    #endif
    }

void wifi::hostAP(void * pvParameters){
#ifdef CONFIG_WIFI_ACTIVE
    WiFiManager wifiManager;
    wifiManager.autoConnect(ssid,password);
    configTime(0,0,"pool.ntp.org");
    connected = true;
    vTaskDelete(NULL);
#else
    connected = false;
    Serial.println("please recompile with wifi enabled");
    vTaskDelete(NULL);
#endif
}
void wifi::hostServer(void * pvParameters){
#ifdef CONFIG_WIFI_ACTIVE
    while (!connected){
    Serial.println("waiting for connection");
      vTaskDelay(5000/portTICK_PERIOD_MS);
    }
    Serial.println("starting...");
    if (!MDNS.begin(domain)){
        Serial.println("Error setting up MDNS responder!");
        vTaskDelete(NULL);
    }

    Serial.println("starting mdns responder");
    MDNS.addService("http","tcp",80);

    server.on("/",handleRoot);
    server.on("/api/bankvalues",HTTP_GET,getBankValues);
    server.on("/api/gamehistory",HTTP_GET,getGameHistory);
    server.on("/api/exactdispense",HTTP_POST,dispenseExactAmount);
    server.on("/api/denominationdispense",HTTP_POST,dispenseSpecificDenomination);
    server.on("/api/emptybank",HTTP_DELETE,dispenseAll);
    server.begin();
    Serial.println("HTTP server started");
    while(true){
    server.handleClient();
    vTaskDelay(10/portTICK_PERIOD_MS);
    }
#else
    Serial.println("please recompile with wifi enabled");
    vTaskDelete(NULL);
#endif
}

//implementation of handlers
void handleRoot(){
#ifdef CONFIG_WIFI_ACTIVE
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());

    server.send(200,"text/plain","hohoho MONEY!!");
#endif
}

void getBankValues(){
#ifdef CONFIG_WIFI_ACTIVE
    //we should log the incoming connection stuff
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());
//this is FUCKIGN DEPRICATED but i'm not fixing it because fuck you
    DynamicJsonDocument doc(1024);
    //should be in the form of {coinValue:amount}
    for (int i = 0; i < fileOps::MAX_COINBANK; i++){
        int coinType = fileOps::coinIndexToValue(i);
        if (coinType == NULL || coinType == 0) continue;
        doc[std::to_string(coinType)] = fileOps::readCoinData(i);
    }
    String output;
    serializeJson(doc,output);
    server.send(200,"application/json",output);
#endif
}

void getGameHistory(){
#ifdef CONFIG_WIFI_ACTIVE
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());
    String json = fileOps::readGameHistoryJson();
    if (json == ""){
        server.send(500,"text/plain","failed to read game history");
    }
    else{
        server.send(200,"application/json",json);
    }
#endif
}

/*
void dispenseExactAmount();
void dispenseSpecificDenomination();
void dispenseAll();
*/
void dispenseExactAmount(){
    #ifdef CONFIG_WIFI_ACTIVE
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());
    server.send(501,"text/plain","not implemented");
    #endif
}

void dispenseSpecificDenomination(){
    #ifdef CONFIG_WIFI_ACTIVE
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());
    server.send(501,"text/plain","not implemented");
    #endif
}

void dispenseAll(){
    #ifdef CONFIG_WIFI_ACTIVE
    Serial.printf("Incoming connection from %s\n",server.client().remoteIP().toString().c_str());
    server.send(501,"text/plain","not implemented");
    #endif
}