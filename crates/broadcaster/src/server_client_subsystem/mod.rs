use std::collections::HashMap;
use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::{accept, connect, Message};

pub struct Record {
    pub name: String,
    pub data: String,
    pub t: String,
}

pub struct Client {
    socket:
        Option<tungstenite::WebSocket<tungstenite::stream::MaybeTlsStream<std::net::TcpStream>>>,
    replicated_database: HashMap<String, Record>,
}
impl Client {
    pub fn new() -> Self {
        Client {
            socket: None,
            replicated_database: HashMap::new(),
        }
    }

    pub fn connect_to_server(&mut self, request: &str) {
        let (mut socket, _response) = connect(request).expect("Failed to connect to server.");

        self.socket = Some(socket);
    }

    pub fn send_database(&mut self) {
        if self.socket.is_some() {
            for (key, value) in self.replicated_database.iter() {
                self.socket
                    .as_mut()
                    .unwrap()
                    .send(Message::Text(
                        value.data.clone().into(),
                    ))
                    .expect("Failed to send database to server");
            }
        }
    }

    pub fn modify_record(&mut self, key: String, new_value: Record) {
        if self.replicated_database.contains_key(&key) {
            *self.replicated_database.get_mut(&key).unwrap() = new_value;
        }
    }

    pub fn get_record(&mut self, key: String) -> Option<&String> {
        if self.replicated_database.contains_key(&key) {
            return Some(&self.replicated_database.get(&key).unwrap().data)
        }

        None
    }

    pub fn new_record(&mut self, key: String, value: String, t: String) {
        let record = Record {
            name: key.clone(),
            data: value,
            t,
        };

        self.replicated_database.insert(key, record);
    }
}

struct Server {
    server: Option<TcpListener>,
}
impl Server {
    pub fn broadcast(&mut self, address: String) {
        
    }
}

//TODO: protect server opening calls
pub fn open_server() {
    spawn(move || {
        println!("Server open initiated");

        let server = TcpListener::bind("127.0.0.1:9999").unwrap();

        for stream in server.incoming() {
            spawn(move || {
                let mut websocket = accept(stream.unwrap()).unwrap();

                loop {
                    let message: Result<Message, tungstenite::Error> = websocket.read();

                    match message {
                        Ok(v) => {
                            println!("{v}");
                        }

                        Err(_) => {
                            continue;
                        }
                    }
                }
            });
        }
    });
}
