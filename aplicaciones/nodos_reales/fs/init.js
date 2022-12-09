load("api_config.js");
load("api_esp32.js");
load("api_gpio.js");
load("api_sys.js");
load("api_mqtt.js");
load("api_timer.js");
load("api_adc.js");
load("api_dht.js");
load('api_rpc.js');

// id
let id = '30a9137e411b3b0e96428db025000217';

// tópicos MQTT
let inicio = 'inicio/' + id;
let tiempo = 'tiempo/' + id;
let sensores = 'sensores/' + id;
let actuadores = 'actuadores/'  + id;
let control = 'control/' + id;

// pins usados
let pin1 = 4;
let pin2 = 32;
let pin3 = 27;
// tiempo inicial
let t = 1;
// pasos en el temporizador
let pt = 0;
// cantidad de lecturas realizadas
let tc = 0;
// cantidad de lecturas a realizar
let cl = 12;
// estado de bomba de agua
let bomba = 'Off';
// valores a enviar al conectarse
let datos = {
  tiempo: t,
  sensores: ['temperatura-ambiente', 'humedad-suelo', 'humedad-ambiente'],
  actuadores: ['bomba-agua'],
};

// habilito ADC en pin2
let correcto =  ADC.enable(pin2);
// defino pin para lectura de DHT22
let dht22 = DHT.create(pin1, DHT.DHT22);
// en salida puerto bomba
GPIO.set_mode(pin3, GPIO.MODE_OUTPUT);
GPIO.write(pin3, 0);
print("Estado bomba de agua: ", GPIO.read(pin3));

// publico datos de inicio
let res = MQTT.pub(inicio, JSON.stringify(datos), 1);
print('Valor paso inicio:', res);
print('Datos de inicio:', JSON.stringify(datos));
// inicio variables acumuladoras
let ta = 0.0;
let ha = 0.0;
let hs = 0.0;

// temporizador cada 5 segundos
Timer.set(5000, Timer.REPEAT, function() {
    // sumo pasos
    pt++;
    print('Paso: ', pt);
    // si el paso del temporizador es igual al tiempo
    if (pt === t) {
        tc++;
        pt = 0;
        print('Lectura: ', tc);
        // obtengo datos
        ADC.enable(pin2);
	    ta = ta + dht22.getTemp();
        ha = ha + dht22.getHumidity();
        hs = hs + 100 - ((ADC.read(pin2) / 4095) * 100);
        if (tc === cl) { // 12 lecturas por ciclo de envío 
    	    // publico datos
            let msj = {
                'temperatura-ambiente': ta / cl,
                'humedad-ambiente' : ha / cl,
                'humedad-suelo' : hs / cl,
            };
            print('Publicando en: ', sensores, ', ', JSON.stringify(msj));
            MQTT.pub(sensores, JSON.stringify(msj), 1);
            tc = 0;
            ta = 0.0;
            ha = 0.0;
            hs = 0.0;
        }
    }
}, null);

// subs. tiempo
MQTT.sub(tiempo, function(conn, topic, msg) {
  msg = JSON.parse(msg);
  print('Recibiendo: ', JSON.stringify(msg));
  t = msg.valor;
  // reinicio valores (se descarta lo realizado)
  pt = 0;
  tc = 0;
  ta = 0.0;
  ha = 0.0;
  hs = 0.0;  
  print('Nuevo tiempo: ', t, ', publicando nuevo tiempo: ', JSON.stringify(msg));
  MQTT.pub(actuadores, JSON.stringify(msg), 1);  
}, null);

// subs. control
MQTT.sub(control, function(conn, topic, msg) {
  msg = JSON.parse(msg);
  if(msg.actuador === 'bomba-agua') {
    if (bomba !== msg.valor) {
      bomba = msg.valor;
      let estado = GPIO.toggle(pin3);
      print('Estado pin: ', estado);
      print('Nuevo estado bomba: ', bomba, ', publicando nuevo estado: ', JSON.stringify(msg));
      MQTT.pub(actuadores, JSON.stringify(msg), 1);
    }      
  }
}, null);

