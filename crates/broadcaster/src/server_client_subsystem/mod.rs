use std::{collections::HashMap, net::TcpStream};
use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::{accept, connect, protocol::frame::coding::Data, Message, WebSocket};

//TODO: remove the t and opt for serde's type inference

type Callback = fn(String);

pub struct Record {
    pub name: String,
    pub data: String,
    pub t: String,
}

pub trait DataManager {
    fn modify_record(&mut self, key: String, new_value: Record);
    fn get_record(&self, key: String) -> Option<&Record>;
    fn new_record(&mut self, key: String, value: String, t: String);
    fn remove_record(&mut self, key: String);
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
}
impl DataManager for Client {
    fn modify_record(&mut self, key: String, new_value: Record) {
        if self.replicated_database.contains_key(&key) {
            *self.replicated_database.get_mut(&key).unwrap() = new_value;
        }
    }

    fn get_record(&self, key: String) -> Option<&Record> {
        if self.replicated_database.contains_key(&key) {
            return Some(&self.replicated_database.get(&key).unwrap())
        }

        None
    }

    fn new_record(&mut self, key: String, value: String, t: String) {
        let record = Record {
            name: key.clone(),
            data: value,
            t,
        };

        self.replicated_database.insert(key, record);
    }

    fn remove_record(&mut self, key: String) {
        if self.replicated_database.contains_key(&key) {
            self.replicated_database.remove(&key);
        }
    }
}

struct Server {
    server: Option<TcpListener>,
    replicated_database: HashMap<String, Record>,
    on_recieved_callbacks: Vec<Callback>,
}
impl Server {
    pub fn new() -> Self {
        Server {
            server: None,
            replicated_database: HashMap::new(),
            on_recieved_callbacks: vec![],
        }
    }

    pub fn open(&mut self, address: String) {
        let server = TcpListener::bind(address);

        if server.is_ok() {
            self.server = Some(server.unwrap());
        }
    }

    pub fn bind_to_recieved(&mut self, method: Callback) {
        self.on_recieved_callbacks.push(method);
    }
}
impl DataManager for Server {
    fn modify_record(&mut self, key: String, new_value: Record) {
        if self.replicated_database.contains_key(&key) {
            *self.replicated_database.get_mut(&key).unwrap() = new_value;
        }
    }

    fn get_record(&self, key: String) -> Option<&Record> {
        if self.replicated_database.contains_key(&key) {
            return Some(&self.replicated_database.get(&key).unwrap())
        }

        None
    }

    fn new_record(&mut self, key: String, value: String, t: String) {
        let record = Record {
            name: key.clone(),
            data: value,
            t,
        };

        self.replicated_database.insert(key, record);
    }

    fn remove_record(&mut self, key: String) {
        if self.replicated_database.contains_key(&key) {
            self.replicated_database.remove(&key);
        }
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
