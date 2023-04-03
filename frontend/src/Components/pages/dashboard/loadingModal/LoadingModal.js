import React from 'react'
import {
    MoonLoader, PulseLoader
} from "react-spinners/";
export const LoadingModal = () => {
  return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 200,
                }}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '5px',
                        width: '250px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <MoonLoader
                        color="#36d7b7"
                        loading={true}
                        size={80}
                        speedMultiplier={0.9}
                    />

                    <div style={{
                        display: "flex"
                    }}>
                        <h5 style={{ textAlign: 'center', marginTop: "20px" }}>Please Wait </h5>
                        <div style={{
                            marginTop: '25px',
                            marginLeft: '5px',

                        }}>
                            <PulseLoader
                                color="black"
                                loading={true}
                                size={5}
                                width={25}
                                speedMultiplier={0.9}
                            />
                        </div>
                    </div>
                </div>
            </div>
  )
}
