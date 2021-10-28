import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name: '';
        avatar: string;
    }
    content: string;
    isAnswared: boolean;
    isHighLighted: boolean;
}>

type RoomParams = {
    id: string;
}

type Question= {
    id: string;
    author: {
        name: '';
        avatar: string;
    }
    content: string;
    isAnswared: boolean;
    isHighLighted: boolean;
}

export function Room(){
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [ newQuestion, setNewQuestion ] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestion: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswared: value.isAnswared,
                }
            });
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);
        })
    }, [roomId]);

    async function handleSendQuetion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim() === '') return;

        if(!user) throw new Error('You must be logged in');

        console.log(user)
        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswared: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 &&  <span>{questions.length} Pergunta(s)</span>  }
                </div>

                <form onSubmit={handleSendQuetion}>
                    <textarea placeholder="O que você quer perguntar ?" onChange={event => setNewQuestion(event.target.value)} value={newQuestion}></textarea>

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                            ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
                        ) }
                    
                        <Button type="submit" className="button" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
        </div>
    );
}