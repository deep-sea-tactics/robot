package jinputjoysticktestv2;

import java.awt.Dimension;
import java.awt.FlowLayout;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JToggleButton;
import net.java.games.input.Component;
import net.java.games.input.Component.Identifier;
import net.java.games.input.Controller;
import net.java.games.input.ControllerEnvironment;

public class JoystickTest {
    
    public static void main(String args[]) {
        new JoystickTest();
    }
    
    
    final JFrameWindow window;
    private final ArrayList<Controller> foundControllers;
    private final EchoClient echoClient;
    private int rotationPercent = 0;
    private final boolean triggerVal = false; //button #0
    private double hatSwitchVal = 0.0;
    
    //motor % variables & button on/off variables
    private int RFmotor = 0; //this.getmotorPercentage_RF(x_axisPercent, y_axisPercent, rotationPercent);
    private int LFmotor = 0; //this.getmotorPercentage_LF(x_axisPercent, y_axisPercent, rotationPercent);
    private int RUmotor = 0; //this.getmotorPercentage_RU(x_axisPercent, y_axisPercent, hatSwitchVal);
    private int LUmotor = 0; //this.getmotorPercentage_LU(x_axisPercent, y_axisPercent, hatSwitchVal);
    private int pButton7, pButton4, pButton2, pButton8, pButton9, pRUMotorVal, pLUMotorVal = 0; //keeps track of the last value of the buttons
    private int Button4, Button7, Button2, Button0, Button1, Button8, Button9 = 0;
    private int Button5, Button3, pButton5, pButton3, Button6, pButton6, Button10, pButton10, Button11, pButton11 = 0;
    private int accservo1, accservo2 = 0;
    
    private String motorCommand;
    
    
    public JoystickTest() {
        window = new JFrameWindow();
        echoClient = new EchoClient();
        
        foundControllers = new ArrayList<>();
        searchForControllers();
        
        // If at least one controller was found we start showing controller data on window.
        if(!foundControllers.isEmpty())
            startShowingControllerData();
        else
            window.addControllerName("No controller found!");
    }

    protected void finalize() {
        echoClient.disconnect(); 
    }
    /**
     * Search (and save) for controllers of type Controller.Type.STICK,
     * Controller.Type.GAMEPAD, Controller.Type.WHEEL and Controller.Type.FINGERSTICK.
     */
    private void searchForControllers() {
        Controller[] controllers = ControllerEnvironment.getDefaultEnvironment().getControllers();

        for (Controller controller : controllers) {
            if (
                    controller.getType() == Controller.Type.STICK ||
                    controller.getType() == Controller.Type.GAMEPAD || 
                    controller.getType() == Controller.Type.WHEEL ||
                    controller.getType() == Controller.Type.FINGERSTICK
                    )
            {
                // Add new controller to the list of all controllers.
                foundControllers.add(controller);
                
                // Add new controller to the list on the window.
                window.addControllerName(controller.getName() + " - " + controller.getType().toString() + " type");
            }
        }
    }
    
    /**
     * Starts showing controller data on the window.
     */
    private void startShowingControllerData(){
        while(true)
        {
            // Currently selected controller.
            int selectedControllerIndex = window.getSelectedControllerName();
            Controller controller = foundControllers.get(selectedControllerIndex);

            // Pull controller for current data, and break while loop if controller is disconnected.
            if( !controller.poll() ){
                window.showControllerDisconnected();
                break;
            }
            
            // X axis and Y axis
            int xAxisPercentage = 0;
            int yAxisPercentage = 0;
            // JPanel for other axes.
            JPanel axesPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 25, 2));
            axesPanel.setBounds(0, 0, 200, 190);
            
            // JPanel for controller buttons
            JPanel buttonsPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 1, 1));
            buttonsPanel.setBounds(6, 19, 246, 110);
                    
            // Go trough all components of the controller.
            Component[] components = controller.getComponents();
            for (Component component : components) {
                Identifier componentIdentifier = component.getIdentifier();
                
                // Buttons
                //if(component.getName().contains("Button")){ // If the language is not english, this won't work.
                if(componentIdentifier.getName().matches("^[0-9]*$")){ // If the component identifier name contains only numbers, then this is a button.
                    // Is button pressed?
                    boolean isItPressed = true;
                    if(component.getPollData() == 0.0f)
                        isItPressed = false;
                    // Button index
                    String buttonIndex;
                    buttonIndex = component.getIdentifier().toString();
                    
                    //**********************Button Data******************************
                    int buttonIndexsend = Integer.parseInt(component.getIdentifier().toString()); //buttonIndexsend: Button Number & buttonComponents: Button Value (either 1 or 0)
                    int buttonComponents = (int) component.getPollData(); 
                    //String buttonData = buttonIndexsend + ":" + buttonComponents + ", "; // 0 not pressed, 1 pressed
                    //System.out.println(buttonData);
                    
                    
                    //Trigger Button (Allows the user to drive the ROV) 
                    if(buttonIndexsend == 0) {
                        if(buttonComponents == 1){
                            Button0 = 1;         //button0's push state. True when pushed False when not pushed
                        } else {
                             Button0 = 0;
                        }
                    }
                    
                    if(buttonIndexsend == 1) {
                        if(buttonComponents == 1){
                            Button1 = 1;         //button0's push state. True when pushed False when not pushed
                        } else {
                             Button1 = 0;
                        }
                    }
                    
                    
                    if (buttonIndexsend == 7) {
                        if (buttonComponents == 1 && pButton7 == 0) { //button that turns lights on and off
                            Button7 = 1;
                        } else {
                            Button7 = 0;
                        }
                        pButton7 = buttonComponents;
                    }
                    
                    //Button left of Hat Switch Top (4)
                    if (buttonIndexsend == 4) {
                        if (buttonComponents == 1 && pButton4 == 0) {  //button increases power to the ROV lights                       
                            Button4 = 1;
                        }else {
                            Button4 = 0;
                        }
                        pButton4 = buttonComponents;
                    }
                    
                                        
                    //Button left of Hat Switch Bottom (2)
                    if (buttonIndexsend == 2) {
                        if (buttonComponents == 1 && pButton2 == 0) {  //button decreases power to the ROV lights                       
                            Button2 = 1;
                        }else {
                            Button2 = 0;
                        }
                        pButton2 = buttonComponents;
                    }
                    
                    //Button 6 on the controller
                    if (buttonIndexsend == 5) {
                        if (buttonComponents == 1 && pButton5 == 0) {  //controlls accessory servo                       
                            Button5 = 1;
                        } else {
                            Button5 = 0;
                        }
                        pButton5 = buttonComponents;
                    }
                    
                    //Button 4 on the controller
                    if (buttonIndexsend == 3) {
                        if (buttonComponents == 1 && pButton3 == 0) {  //controlls accessory servo                       
                            Button3 = 1;
                        } else {
                            Button3 = 0;
                        }
                        pButton3 = buttonComponents;
                    }
                    
                    //Button 9 on the controller
                    if (buttonIndexsend == 8) {
                        if (buttonComponents == 1 && pButton8 == 0) {  //button decreases power to the RU and LU motors                       
                            Button8 = 1;
                        } else {
                            Button8 = 0;
                        }
                        pButton8 = buttonComponents;
                    }
                    
                    //button 10 on the controller
                    if (buttonIndexsend == 9) {
                        if (buttonComponents == 1 && pButton9 == 0) {  //button increases power to the RU and LU motors                       
                            Button9 = 1;
                        } else {
                            Button9 = 0;
                        }
                        pButton9 = buttonComponents;
                    }
                    
                    //button 7 on the controller
                    if (buttonIndexsend == 6) {
                        if (buttonComponents == 1 && pButton6 == 0) {  //button zero's out motors RU and LU                       
                            Button6 = 1;
                        } else {
                            Button6 = 0;
                        }
                        pButton6 = buttonComponents;
                    }                    
                    //button 11 on the controller
                    if (buttonIndexsend == 10) {
                        if (buttonComponents == 1 && pButton10 == 0) {  //button zero's out motors RU and LU                       
                            Button10 = 1;
                        } else {
                            Button10 = 0;
                        }
                        pButton10 = buttonComponents;
                    }  
                    
                    //button 12 on the controller
                    if (buttonIndexsend == 11) {
                        if (buttonComponents == 1 && pButton11 == 0) {  //button zero's out motors RU and LU                       
                            Button11 = 1;
                        } else {
                            Button11 = 0;
                        }
                        pButton11 = buttonComponents;
                    }   
                    
                    
                    
                    // Create and add new button to panel.
                    JToggleButton aToggleButton = new JToggleButton(buttonIndex, isItPressed);
                    aToggleButton.setPreferredSize(new Dimension(48, 25));
                    aToggleButton.setEnabled(false);
                    buttonsPanel.add(aToggleButton);
                    // We know that this component was button so we can skip to next component.
                    continue;
                }
                
                // Hat switch
                if(componentIdentifier == Component.Identifier.Axis.POV){
                    float hatSwitchPosition = component.getPollData();
                    window.setHatSwitch(hatSwitchPosition);
                    
                    hatSwitchVal = hatSwitchPosition;                    
                    // We know that this component was hat switch so we can skip to next component.
                    continue;
                }
                
                // Axes
                if(component.isAnalog()){
                    float axisValue = component.getPollData();
                    int axisValueInPercentage = getAxisValueInPercentage(axisValue);
                    // X axis
                    if(componentIdentifier == Component.Identifier.Axis.X){
                        xAxisPercentage = axisValueInPercentage;
                        continue; // Go to next component.
                    }
                    // Y axis
                    if(componentIdentifier == Component.Identifier.Axis.Y){
                        yAxisPercentage = axisValueInPercentage;
                        continue; // Go to next component.
                    }
                    
                    // Other axis
                    JLabel progressBarLabel = new JLabel(component.getName());
                    JProgressBar progressBar = new JProgressBar(0, 100);
                    progressBar.setValue(axisValueInPercentage);
                    axesPanel.add(progressBarLabel);
                    axesPanel.add(progressBar);
                  
                  int x = 0;
                  if(axisValueInPercentage == 100) {
                      x++;
                  }else{
                  rotationPercent = axisValueInPercentage;
                  }
                  
                }
            }
            
            // Now that we go trough all controller components,
            // we add butons panel to window,
            window.setControllerButtons(buttonsPanel);
            // set x and y axes,
            window.setXYAxis(xAxisPercentage, yAxisPercentage);
            // add other axes panel to window.
            window.addAxisPanel(axesPanel);
            
            
            
            //controller % data
            RFmotor = this.getmotorPercentage_RF(xAxisPercentage, yAxisPercentage, rotationPercent);
            LFmotor = this.getmotorPercentage_LF(xAxisPercentage, yAxisPercentage, rotationPercent);
            RUmotor = this.getmotorPercentage_RU(xAxisPercentage, yAxisPercentage, hatSwitchVal);
            LUmotor = this.getmotorPercentage_LU(xAxisPercentage, yAxisPercentage, hatSwitchVal);
            
           //allows motors to move only when trigger is pulled
            if(Button0 == 1) {
                 //motorCommand = this.getMotorPercentages(pRUMotorVal, pLUMotorVal, LFmotor, RFmotor);
                //motorCommand = this.getMotorPercentages(pRUMotorVal, pLUMotorVal, LFmotor, RFmotor);
                motorCommand = this.getMotorPercentages(LFmotor, RFmotor, pRUMotorVal, pLUMotorVal);
            }else {
                motorCommand = "0" + " " + "0" + " " + pRUMotorVal + " " + pLUMotorVal;
            }
            
            //allows accessory servo to use one spot on the array
            if(pButton3 == 1) {
                accservo1 = -1;
            }
            else if(pButton5 == 1){
                accservo1 = 1;
            }
            else{
                accservo1 = 0;
            }
            
            //allows second servo to be controlled and use one spot on the array
            if(pButton11 == 1) {
                accservo2 = 1;
            }
            else if(pButton10 == 1){
                accservo2 = -1;
            }
            else{
                accservo2 = 0;
            }
            
           //Send motor     data to the server on the Pi            
           String command = motorCommand + " " + Button7 + " " + Button4 + " " + Button2 + " " + accservo1 + " " + accservo2 + '\n';
           echoClient.send(command);
           
           
           //******************Testing commands******************
           //this.getmotorPercentage_RF(xAxisPercentage, yAxisPercentage, rotationPercent);
           //this.getmotorPercentage_LF(xAxisPercentage, yAxisPercentage, rotationPercent);
           //this.getmotorPercentage_RU(xAxisPercentage, yAxisPercentage, hatSwitchVal);
           //this.getmotorPercentage_LU(xAxisPercentage, yAxisPercentage, hatSwitchVal);
           
           //System.out.println(rotationPercent);                  
            //******************Testing commands******************
            
            //Processor rest time
            try {
                Thread.sleep(40);
            } catch (InterruptedException ex) {
                Logger.getLogger(JoystickTest.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        
    }
    //sending Motor data to window
    public int getMotorValRU(){
        return RUmotor;
    }
    public int getMotorValLU(){
        return LUmotor;
    }
    public int getMotorValRF(){
        return RFmotor;
    }
    public int getMotorValLF(){
        return LFmotor;
    }
    
    
        //**********************testing****************************
    // for the right front motor %
    public int getmotorPercentage_RF(int xAxisPercentage, int yAxisPercentage, int rotationPercent) {
        int motor_RF = 0;
        double dividedNum = 100.0 / 35.0;
        
        if(Button1 == 0) {
            //rotation controls turning right and left
            if (rotationPercent < 35) {
                //motor_RF = (int) (100 - dividedNum * rotationPercent);;
            } else if (rotationPercent > 65) {
                motor_RF = (int) (((rotationPercent - 65) * dividedNum) * -1);
            } else {
                motor_RF = 0;
            }

            //going forward and right bc decreasing
            if (yAxisPercentage < 35) {
                motor_RF = (int) (100 - dividedNum * yAxisPercentage);
            } else if (yAxisPercentage > 65) {
                motor_RF = (int) (((yAxisPercentage - 65) * dividedNum) * -1);
            }
        }
        //System.out.println("RF: " + motor_RF);
        return motor_RF;
    }

    //for the right forward motor %
    public int getmotorPercentage_LF(int xAxisPercentage, int yAxisPercentage, int rotationPercent) {
        int motor_LF = 0;
        double dividedNum = 100.0 / 35.0;
        int rotationAdjustment = 0;
        if(Button1 == 0) {
            //rotation controls turning right and left
            if (rotationPercent < 35) {
               motor_LF = (int) ((100 - dividedNum * rotationPercent) * -1);
            } else if (rotationPercent > 65) {
               //motor_LF = (int) ((rotationPercent - 65) * dividedNum);
            } else {
               motor_LF = 0;
            }

            //moving forward and left bc decreasing
            if (yAxisPercentage < 35) {
                motor_LF = (int) ((100 - dividedNum * yAxisPercentage) + rotationAdjustment);
            } else if (yAxisPercentage > 65) {
             motor_LF = (int) ((yAxisPercentage - 65) * dividedNum * -1);
            }
        }
        //System.out.println("LF: " + motor_LF);
        return motor_LF;
    }

    //for the right up motor %
    public int getmotorPercentage_RU(int xAxisPercentage, int yAxisPercentage, double hatSwitchVal) {
        int motor_RU = 0;
        double dividedNum = 100.0 / 35.0;
        //if statement controls the side to side orientation
        if(Button1 == 0) {
            if (xAxisPercentage < 35) {
                motor_RU = (int) (100 - dividedNum * xAxisPercentage);
            } else {
                motor_RU = 0;
            }
        }
               
        if(Button1 == 1){
            if (yAxisPercentage < 35) {
                motor_RU = (int) (100 - dividedNum * yAxisPercentage);                
                pRUMotorVal = motor_RU;                
            } else if (yAxisPercentage > 65) {
                motor_RU = (int) (((yAxisPercentage - 65) * dividedNum) * -1);
                pRUMotorVal = motor_RU;
            }              
        }
        
        if (Button9 == 1) {
            pRUMotorVal = pRUMotorVal + 5;
        } 
        if (Button8 == 1) {
            pRUMotorVal = pRUMotorVal - 5;
        } 
        if (Button6 == 1){
            pRUMotorVal = 0;
        }
        
        return motor_RU;
    }
    
    //for the left up motor %
    public int getmotorPercentage_LU(int xAxisPercentage, int yAxisPercentage, double hatSwitchVal) {
        int motor_LU = 0;
        double dividedNum = 100.0 / 35.0;
        //controls the side to side orientation
        if(Button1 == 0) {
            if (xAxisPercentage > 65) {
                motor_LU = (int) ((xAxisPercentage - 65) * dividedNum);
            } else {
                motor_LU = 0;
            }
        }                
        
        if (Button1 == 1) {
            if (yAxisPercentage < 35) {
                motor_LU = (int) (100 - dividedNum * yAxisPercentage);
                pLUMotorVal = motor_LU;
            } else if (yAxisPercentage > 65) {
                motor_LU = (int) (((yAxisPercentage - 65) * dividedNum) * -1);
                pLUMotorVal = motor_LU;
            }
        }
        
        if (Button9 == 1) {
            pLUMotorVal = pLUMotorVal + 5;
        } 
        if (Button8 == 1) {
            pLUMotorVal = pLUMotorVal - 5;
        }
        if (Button6 == 1){
            pLUMotorVal = 0;
        }
        
        return motor_LU;
    }
    
    
     //prints out all of the motor % values
     public String getMotorPercentages(int RFmotor, int LFmotor, int RUmotor, int LUmotor) {
         String percents = RFmotor + " " + LFmotor + " " + RUmotor + " " + LUmotor;
         return percents;
     }
    
    
    /**
     * Given value of axis in percentage.
     * Percentages increases from left/top to right/bottom.
     * If idle (in center) returns 50, if joystick axis is pushed to the left/top 
     * edge returns 0 and if it's pushed to the right/bottom returns 100.
     * 
     * @return value of axis in percentage.
     */
    public int getAxisValueInPercentage(float axisValue)
    {
        return (int)(((2 - (1 - axisValue)) * 100) / 2);
    }
}
