

import { useHistory } from 'react-router';
import { FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg'

import { database } from '../services/firebase';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';




export function Home(){

    const history = useHistory();
    const { user, signInWithGoole } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCrateRoom(){
        if(!user){
           await signInWithGoole();
        }
        history.push('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === '') return;

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if(!roomRef.exists()){
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt){
            alert('Room already closed')
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return(

        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                
                    <img src={logoImg} alt="letmeask" />
                    <button onClick={handleCrateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder="Digite o código da sala" onChange={event => setRoomCode(event.target.value)} value={roomCode} />
                        <Button type="submit" className="button"> Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}