import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const API_URL = 'http://3.84.213.214:5000/api/status';

const operations = {
    1: { status: 1, accion: "adelante" },
    2: { status: 2, accion: "atrás" },
    3: { status: 3, accion: "izquierda" },
    4: { status: 4, accion: "derecha" },
    5: { status: 5, accion: "detener" },
    6: { status: 6, accion: "giro derecha" },
    7: { status: 7, accion: "giro izquierda" },
    8: { status: 8, accion: "luces delantera" },
    9: { status: 9, accion: "luces trasera" }
};

const App = () => {
    const [actionMessage, setActionMessage] = useState('');

    const sendCommand = async (commandId) => {
        const action = operations[commandId];
        try {
            setActionMessage(action.accion);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: action.status,
                    ip_cliente: '127.0.0.1',  // IP predeterminada
                    name: "Jesus",  
                    id_device: Math.floor(Math.random() * 1000000),
                    accion: action.accion,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            console.log('Command sent:', action.accion);
        } catch (error) {
            console.error('Error sending command:', error.message);
            setActionMessage('Error al enviar el comando');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logoText}>Control Remoto</Text>

            {/* D-Pad */}
            <View style={styles.dpadContainer}>
                <TouchableOpacity style={styles.dpadButton} onPress={() => sendCommand(1)}>
                    <Text style={styles.dpadText}>▲</Text>
                </TouchableOpacity>
                <View style={styles.dpadRow}>
                    <TouchableOpacity style={styles.dpadButton} onPress={() => sendCommand(3)}>
                        <Text style={styles.dpadText}>◄</Text>
                    </TouchableOpacity>
                    <View style={styles.dpadCenter} />
                    <TouchableOpacity style={styles.dpadButton} onPress={() => sendCommand(4)}>
                        <Text style={styles.dpadText}>►</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.dpadButton} onPress={() => sendCommand(2)}>
                    <Text style={styles.dpadText}>▼</Text>
                </TouchableOpacity>
            </View>

            {/* Select and Start Buttons */}
            <View style={styles.selectStartContainer}>
                <TouchableOpacity style={styles.selectStartButton} onPress={() => sendCommand(8)}>
                    <Text style={styles.selectStartText}>LUZ DEL.</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectStartButton} onPress={() => sendCommand(9)}>
                    <Text style={styles.selectStartText}>LUZ TRA.</Text>
                </TouchableOpacity>
            </View>

            {/* A and B Buttons for Rotation */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => sendCommand(6)}>
                    <Text style={styles.actionButtonText}>G. D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => sendCommand(7)}>
                    <Text style={styles.actionButtonText}>G. I</Text>
                </TouchableOpacity>
            </View>

            {/* Stop Button */}
            <View style={styles.stopButtonContainer}>
                <TouchableOpacity style={styles.stopButton} onPress={() => sendCommand(5)}>
                    <Text style={styles.stopButtonText}>DETENER</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.actionMessage}>Acción Actual: {actionMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dpadContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dpadRow: {
        flexDirection: 'row',
    },
    dpadButton: {
        backgroundColor: '#333',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        borderRadius: 5,
    },
    dpadCenter: {
        backgroundColor: '#000',
        width: 50,
        height: 50,
        margin: 3,
    },
    dpadText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    selectStartContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    selectStartButton: {
        backgroundColor: '#555',
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    selectStartText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: 'red',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    stopButtonContainer: {
        marginTop: 20,
    },
    stopButton: {
        backgroundColor: 'red',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 5,
    },
    stopButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionMessage: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
    },
});

export default App;
