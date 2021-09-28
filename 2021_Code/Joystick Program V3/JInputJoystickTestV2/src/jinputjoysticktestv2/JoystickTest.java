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
    //private final EchoClient echoClient;
    //private final MiniClient miniClient;
    private int rotationPercent = 0;
    private final boolean triggerVal = false; //button #0
    private double hatSwitchVal = 0;

    //motor % variables & button on/off variables
    private int RFmotor = 0; //this.getmotorPercentage_RF(x_axisPercent, y_axisPercent, rotationPercent);
    private int LFmotor = 0; //this.getmotorPercentage_LF(x_axisPercent, y_axisPercent, rotationPercent);
    private int RUmotor = 0; //this.getmotorPercentage_RU(x_axisPercent, y_axisPercent, hatSwitchVal);
    private int LUmotor = 0; //this.getmotorPercentage_LU(x_axisPercent, y_axisPercent, hatSwitchVal);
    private int pButton7, pButton4, pButton2, pButton8, pButton9, pRUMotorVal, pLUMotorVal = 0; //keeps track of the last value of the buttons
    private int Button4, Button7, Button2, Button0, Button1, Button8, Button9 = 0;
    private int Button5, Button3, pButton5, pButton3, Button6, pButton6, Button10, pButton10, Button11, pButton11, pButton0, pButton1 = 0;
    private int accservo1, accservo2, sendHat, sendcamera, sendrelay1, miniM, accservo3, lightson, lightsoff, lightstoggle, Servo4 = 0;
    private double doublehat = 0;
    double dividedNum = 2, maxNum = 50, minNum = 50;
    //int maxNum = 51, minNum = 49;

    //private String motorCommand;
    //private String minirov;

    public JoystickTest() {
        window = new JFrameWindow();
        //echoClient = new EchoClient();
        //miniClient = new MiniClient();

        foundControllers = new ArrayList<>();
        searchForControllers();

        // If at least one controller was found we start showing controller data on window.
        if (!foundControllers.isEmpty()) {
            startShowingControllerData();
        } else {
            window.addControllerName("No controller found!");
        }
    }
    /*
    protected void finalize() {
        echoClient.disconnect();
    }
    */
    /**
     * Search (and save) for controllers of type Controller.Type.STICK,
     * Controller.Type.GAMEPAD, Controller.Type.WHEEL and
     * Controller.Type.FINGERSTICK.
     */
    private void searchForControllers() {
        Controller[] controllers = ControllerEnvironment.getDefaultEnvironment().getControllers();

        for (Controller controller : controllers) {
            if (controller.getType() == Controller.Type.STICK
                    || controller.getType() == Controller.Type.GAMEPAD
                    || controller.getType() == Controller.Type.WHEEL
                    || controller.getType() == Controller.Type.FINGERSTICK) {
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
    private void startShowingControllerData() {
        while (true) {
            // Currently selected controller.
            int selectedControllerIndex = window.getSelectedControllerName();
            Controller controller = foundControllers.get(selectedControllerIndex);

            // Pull controller for current data, and break while loop if controller is disconnected.
            if (!controller.poll()) {
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
                if (componentIdentifier.getName().matches("^[0-9]*$")) { // If the component identifier name contains only numbers, then this is a button.
                    // Is button pressed?
                    boolean isItPressed = true;
                    if (component.getPollData() == 0.0f) {
                        isItPressed = false;
                    }
                    // Button index
                    String buttonIndex;
                    buttonIndex = component.getIdentifier().toString();

                    //**********************Button Data******************************
                    int buttonIndexsend = Integer.parseInt(component.getIdentifier().toString()); //buttonIndexsend: Button Number & buttonComponents: Button Value (either 1 or 0)
                    int buttonComponents = (int) component.getPollData();
                    //String buttonData = buttonIndexsend + ":" + buttonComponents + ", "; // 0 not pressed, 1 pressed
                    //System.out.println(buttonData);

                    //Trigger Button (Allows the user to drive the ROV) 
                    if (buttonIndexsend == 0) {
                        if (buttonComponents == 1) {
                            Button0 = 1;         //button0's push state. True when pushed False when not pushed
                        } else {
                            Button0 = 0;
                        }
                        pButton0 = buttonComponents;
                    }

                    if (buttonIndexsend == 1) {
                        if (buttonComponents == 1) {
                            Button1 = 1;         //button0's push state. True when pushed False when not pushed
                        } else {
                            Button1 = 0;
                        }
                        pButton1 = buttonComponents;
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
                        } else {
                            Button4 = 0;
                        }
                        pButton4 = buttonComponents;
                    }

                    //Button left of Hat Switch Bottom (2)
                    if (buttonIndexsend == 2) {
                        if (buttonComponents == 1 && pButton2 == 0) {  //button decreases power to the ROV lights                       
                            Button2 = 1;
                        } else {
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
                if (componentIdentifier == Component.Identifier.Axis.POV) {
                    float hatSwitchPosition = component.getPollData();
                    window.setHatSwitch(hatSwitchPosition);

                    hatSwitchVal = hatSwitchPosition;
                    // We know that this component was hat switch so we can skip to next component.
                    continue;
                }

                // Axes
                if (component.isAnalog()) {
                    float axisValue = component.getPollData();
                    int axisValueInPercentage = getAxisValueInPercentage(axisValue);
                    // X axis
                    if (componentIdentifier == Component.Identifier.Axis.X) {
                        xAxisPercentage = axisValueInPercentage;
                        continue; // Go to next component.
                    }
                    // Y axis
                    if (componentIdentifier == Component.Identifier.Axis.Y) {
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
                    if (axisValueInPercentage == 100) {
                        x++;
                    } else {
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
            RFmotor = this.getmotorPercentage_RF(xAxisPercentage, yAxisPercentage, rotationPercent, dividedNum, maxNum, minNum);
            LFmotor = this.getmotorPercentage_LF(xAxisPercentage, yAxisPercentage, rotationPercent, dividedNum, maxNum, minNum);
            RUmotor = this.getmotorPercentage_RU(xAxisPercentage, yAxisPercentage, hatSwitchVal, dividedNum, maxNum, minNum);
            LUmotor = this.getmotorPercentage_LU(xAxisPercentage, yAxisPercentage, hatSwitchVal, dividedNum, maxNum, minNum);

            /*allows motors to move only when trigger is pulled
            if (Button0 == 1) {
                //motorCommand = this.getMotorPercentages(pRUMotorVal, pLUMotorVal, LFmotor, RFmotor);
                //motorCommand = this.getMotorPercentages(pRUMotorVal, pLUMotorVal, LFmotor, RFmotor);
                motorCommand = this.getMotorPercentages(LFmotor, RFmotor, pRUMotorVal, pLUMotorVal);
            } else {
                motorCommand = "0" + " " + "0" + " " + pRUMotorVal + " " + pLUMotorVal;
            }
            */
            //allows accessory servo to use one spot on the array
            if (pButton2 == 1) {
                accservo1 = -1;
            } else if (pButton4 == 1) {
                accservo1 = 1;
            } else {
                accservo1 = 0;
            }

            //allows second servo to be controlled and use one spot on the array
            if (pButton5 == 1 && Button1 == 0) {
                accservo2 = 1;
            } else if (pButton3 == 1 && Button1 == 0) {
                accservo2 = -1;
            } else {
                accservo2 = 0;
            }

            //allows third servo to be controlled and use one spot on the array
            if (sendHat == 250) {
                accservo3 = 1;
            } else if (sendHat == 750) {
                accservo3 = -1;
            } else {
                accservo3 = 0;
            }

            //Hatswitch
            if (hatSwitchVal == 0) {
                sendHat = 0;
            } else {
                doublehat = hatSwitchVal * 1000;
                sendHat = (int) doublehat;
                //System.out.println(sendHat);
            }

            //Camera Servo
            if (sendHat == 1000) {
                sendcamera = -1;
            } else if (sendHat == 500) {
                sendcamera = 1;
            } else {
                sendcamera = 0;
            }

            //MiniROV Code
            if (Button0 == 1 && Button1 == 1 && Button10 == 0 && Button11 == 0) {
                miniM = 1;
                Servo4 = 0;
            } else if (pButton11 == 1) {
                miniM = 0;
                Servo4 = 1;
            } else if (pButton10 == 1) {
                miniM = 0;
                Servo4 = -1;
            } else if (Button0 == 0 && Button1 == 0 && Button10 == 0 && Button11 == 0) {
                miniM = 0;
                Servo4 = 0;
            }

            if (Button7 == 1 && Button1 == 1) {
                lightstoggle = 1;
            } else {
                lightstoggle = 0;
            }

            if (Button7 == 1 && Button1 == 0) {
                lightson = 1;
            } else {
                lightson = 0;
            }

            if (Button6 == 1 && Button1 == 0) {
                lightsoff = 1;
            } else {
                lightsoff = 0;
            }
            /*//Send motor data to the server on the Pi            
            String command = motorCommand + " " + lightstoggle + " " + lightson + " " + lightsoff + " " + accservo1 + " " + accservo2 + " " + sendcamera + " " + accservo3 + " " + miniM + " " + Servo4 + '\n';
            echoClient.send(command);
            */
            //String minicommand = miniM + " " + sendHat + '\n';
            //miniClient.send(minicommand);
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
    public int getMotorValRU() {
        return RUmotor;
    }

    public int getMotorValLU() {
        return LUmotor;
    }

    public int getMotorValRF() {
        return RFmotor;
    }

    public int getMotorValLF() {
        return LFmotor;
    }

    //**********************testing****************************
    // for the right front motor %
    public int getmotorPercentage_RF(int xAxisPercentage, int yAxisPercentage, int rotationPercent, double dividedNum, double maxNum, double minNum) {
        int motor_RF = 0, motor_RFT = 0, motor_RFF = 0;
        //double dividedNum = 1.25;

        if (Button0 == 1 && Button1 == 0) {
            //rotation controls turning right and left
            if (xAxisPercentage < minNum) {
                motor_RFT = (int) ((xAxisPercentage - minNum) * dividedNum * 1);
            } else if (xAxisPercentage > maxNum) {
                motor_RFT = (int) ((xAxisPercentage - maxNum) * dividedNum * 1);
            } else {
                motor_RFT = 0;
            }
            
            

            //going forward and right bc decreasing
            if (yAxisPercentage < minNum) {
                motor_RFF = (int) ((yAxisPercentage - minNum) * dividedNum);
            } else if (yAxisPercentage > maxNum) {
                motor_RFF = (int) ((yAxisPercentage - maxNum) * dividedNum);
            } else {
                motor_RFF = 0;
            }
        }
        
            
        
        
        
        if (xAxisPercentage >= maxNum && yAxisPercentage <= minNum) {
            motor_RF = ((motor_RFF + motor_RFT) * 1);
        }
        else if (xAxisPercentage <= minNum && yAxisPercentage <= minNum ) {
            motor_RF = ((motor_RFF + motor_RFT) * 1);
        }
        else if (xAxisPercentage <= minNum && yAxisPercentage >= maxNum) {
            motor_RF = ((motor_RFT + motor_RFF) * 1);
        }
        else if (xAxisPercentage >= maxNum && yAxisPercentage >= maxNum) {
            motor_RF = ((motor_RFT + motor_RFF) * 1);
        } 
        
        System.out.println("RF: " + motor_RF);
        System.out.println("RFT " + motor_RFT);
        System.out.println("RFF " + motor_RFF);
        return motor_RF;
    }

    //for the right forward motor %
    public int getmotorPercentage_LF(int xAxisPercentage, int yAxisPercentage, int rotationPercent, double dividedNum, double maxNum, double minNum) {
        int motor_LF = 0, motor_LFT = 0, motor_LFF = 0;
        //double dividedNum = 1.25;
        if (Button1 == 0 && Button2 == 0) {
            //rotation controls turning right and left
            if (xAxisPercentage < minNum) {
                motor_LFT = (int) ((xAxisPercentage - minNum) * dividedNum * -1);
            } else if (xAxisPercentage > maxNum) {
                motor_LFT = (int) ((xAxisPercentage - maxNum) * dividedNum * 1);
            } else {
                motor_LFT = 0;
            }

            //moving forward and left bc decreasing
            if (yAxisPercentage < minNum) {
                motor_LFF = (int) ((yAxisPercentage - minNum) * dividedNum);
            } else if (yAxisPercentage > maxNum) {
                motor_LFF = (int) ((yAxisPercentage - maxNum) * dividedNum);
            }
            
        }
        motor_LF = motor_LFF + motor_LFT;
        //System.out.println("LF: " + motor_LF);
        return motor_LF;
    }

    //for the right up motor %
    public int getmotorPercentage_RU(int xAxisPercentage, int yAxisPercentage, double hatSwitchVal, double dividedNum, double maxNum, double minNum) {
        int motor_RU = 0;
        //double dividedNum = 1.25;
        //if statement controls the side to side orientation
        if (Button1 == 0 && Button0 == 0) {
            if (xAxisPercentage < 30) {
                motor_RU = (int) ((xAxisPercentage - 30));
            } else {
                motor_RU = 0;
            }
        }

        if (Button1 == 1 && Button0 == 0) {
            if (yAxisPercentage < minNum) {
                motor_RU = (int) ((yAxisPercentage - minNum) * dividedNum);
                pRUMotorVal = motor_RU;
            } else if (yAxisPercentage > maxNum) {
                motor_RU = (int) (((yAxisPercentage - maxNum) * dividedNum));
                pRUMotorVal = motor_RU;
            }
        }

        if (Button9 == 1 && Button1 == 0) {
            if (pRUMotorVal < -50) {
                pRUMotorVal = -50;
            }
            else{
                pRUMotorVal = pRUMotorVal - 5;
                }
        }
        if (Button8 == 1 && Button1 == 0) {
            if (pRUMotorVal > 50) {
                pRUMotorVal = 50;
                }
            else{
                pRUMotorVal = pRUMotorVal + 5;
                }
        }
        if (Button6 == 1 && Button1 == 1) {
            pRUMotorVal = 0;
        }

        return motor_RU;
    }

    //for the left up motor %
    public int getmotorPercentage_LU(int xAxisPercentage, int yAxisPercentage, double hatSwitchVal, double dividedNum, double maxNum, double minNum) {
        int motor_LU = 0;
        //double dividedNum = 1.25;
        //controls the side to side orientation
        if (Button1 == 0 && Button0 == 0) {
            if (xAxisPercentage > maxNum) {
                motor_LU = (int) ((xAxisPercentage - maxNum));
            } else {
                motor_LU = 0;
            }
        }

        if (Button1 == 1 && Button0 == 0) {
            if (yAxisPercentage < minNum) {
                motor_LU = (int) ((yAxisPercentage - minNum) * dividedNum);
                pLUMotorVal = motor_LU;
            } else if (yAxisPercentage > maxNum) {
                motor_LU = (int) (((yAxisPercentage - maxNum) * dividedNum));
                pLUMotorVal = motor_LU;
            }
        }

        if (Button9 == 1 && Button1 == 0) {
            if (pLUMotorVal < -50) {
                pLUMotorVal = -50;
                }
            else{
                pLUMotorVal = pLUMotorVal - 5;
                }
        }
        if (Button8 == 1 && Button1 == 0) {
            if (pLUMotorVal > 50) {
                pLUMotorVal = 50;
                }
            else{
                pLUMotorVal = pLUMotorVal + 5;
                }
        }
        if (Button6 == 1 && Button1 == 1) {
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
     * Given value of axis in percentage. Percentages increases from left/top to
     * right/bottom. If idle (in center) returns 50, if joystick axis is pushed
     * to the left/top edge returns 0 and if it's pushed to the right/bottom
     * returns 100.
     *
     * @return value of axis in percentage.
     */
    public int getAxisValueInPercentage(float axisValue) {
        return (int) (((2 - (1 - axisValue)) * 100) / 2);
    }
}
