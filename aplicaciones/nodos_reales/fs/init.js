load("api_config.js");
load("api_esp32.js");
load("api_gpio.js");
load("api_mqtt.js");
load("api_sys.js");
load("api_timer.js");
load("api_adc.js");
load("api_dht.js");

// tópicos MQTT
let inicio = 'inicio/9892d644b7b377b407b57366af0002ff';
let tiempo = 'tiempo/9892d644b7b377b407b57366af0002ff';
let sensores = 'sensores/9892d644b7b377b407b57366af0002ff';
let actuadores = 'actuadores/9892d644b7b377b407b57366af0002ff';
let control = 'control/9892d644b7b377b407b57366af0002ff';

// pins usados
let pin1 = 16;
let pin2 = 15;
// tiempo inicial
let t = 1;
// periodo de tiempo para lecturas (tiempo control)
let tc = 0;
// estado de bomba de agua
let bomba = 'Off';
// valores a enviar al conectarse
let datos = {
  tiempo: t,
  sensores: ['temperatura-ambiente', 'humedad-suelo', 'humedad-ambiente'],
  actuadores: ['bomba-de-agua'],
};

// habilito ADC en pin2
ADC.enable(pin2);
// defino pin para lectura de DHT22
let dht22 = DHT.create(pin1, DHT.DHT22);

// esperar a conectarse
// Sys.usleep(10000000);
// print('Verificando MQTT')
// if (! MQTT.isConnected()) {
// 	Sys.reboot(0);
// }

// publico datos de inicio
let res = MQTT.pub(inicio, JSON.stringify(datos), 1);
print('Datos de inicio:', JSON.stringify(datos));


// temporizador
Timer.set(60000, Timer.REPEAT, function() {
    tc++;
    if (t === tc) {
        // obtengo datos
	    let ta = dht22.getTemp();
	    let ha = dht22.getHumidity();
	    let hs = ADC.read(pin2);
	    // publico datos
        let msj = {
            'temperatura-ambiente': ta,
            'humedad-ambiente' : ha,
            'humedad-suelo' : hs,
        };
        print('Publicando en: ', sensores, ', ', JSON.stringify(msj));
        MQTT.pub(sensores, JSON.stringify(msj), 1);
        tc = 0;
    }
}, null);

// subs. tiempo
MQTT.sub(tiempo, function(conn, topic, msg) {
  msg = JSON.parse(msg);
  print('Recibiendo: ', JSON.stringify(msg));
  t = msg.valor;
  print('Nuevo tiempo: ', t, ', publicando nuevo tiempo: ', JSON.stringify(msg));
  MQTT.pub(actuadores, JSON.stringify(msg), 1);  
}, null);

// subs. control
MQTT.sub(control, function(conn, topic, msg) {
  msg = JSON.parse(msg);
  if(msg.actuador === 'bomba-de-agua') {
    if (bomba !== msg.valor) {
      bomba = msg.valor;
      print('Nuevo estado bomba: ', bomba, ', publicando nuevo estado: ', JSON.stringify(msg));
      MQTT.pub(actuadores, JSON.stringify(msg), 1);
    }      
  }
}, null);

