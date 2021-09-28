/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package jinputjoysticktestv2;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 *
 * @author brice
 */
public class EchoClient {
        Socket pingSocket = null;
        PrintWriter out = null;
        BufferedReader in = null;
        
    public void connect() {
       
        try {
            pingSocket = new Socket("192.168.3.116", 9000);
            out = new PrintWriter(pingSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(pingSocket.getInputStream()));
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    public void disconnect(){
        if(pingSocket == null || out == null || in == null) {
            System.out.println("vars null in disconnect");
            return;
        }
        
      try {
           out.close();
           in.close();
           pingSocket.close();
        } catch (IOException e) {
           System.out.println(e);
        }
      System.out.println("Disconnected");
      pingSocket = null;
      out = null;
      in = null;
    }
    
    public void send(String message) {
        if(!isConnected()) {
            connect();
        }
        if (isConnected()) {
            out.println(message);
        }
    }
    
    public boolean isConnected() {
        if (pingSocket == null || out == null || in == null) {
            return false;
        }
        return true;
    }
}