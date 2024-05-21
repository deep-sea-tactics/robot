use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::{accept, connect, Message};

//TODO: protect server opening calls
pub fn open_server() {
    spawn(move || {
        println!("Server open initiated");

        let server = TcpListener::bind("127.0.0.1:9999").unwrap();
    
        for stream in server.incoming() {
            spawn(move || {
                let mut websocket = accept(stream.unwrap()).unwrap();
    
                loop {
                    let message = websocket.read().unwrap();
    
                    println!("{message}");
                }
            });
        }
    });
}

pub fn open_client() {
    spawn(move || {
        println!("Client open initiated");

        let (mut socket, response) = connect("ws://localhost:9999/").expect("failed to connect to serber");
        
        loop {
            socket.send(Message::Text("Yo".into())).unwrap();
        } 
    });
}