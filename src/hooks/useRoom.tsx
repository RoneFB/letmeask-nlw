import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionParms = {
    id: string;
    author: {
        name: '';
        avatar: string;
    }
    content: string;
    isAnswared: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: '';
        avatar: string;
    }
    content: string;
    isAnswared: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionParms[]>([]);
    const [title, setTitle] = useState('');

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions);
        })


        return () => {
            roomRef.off('value');
        }

    }, [roomId, user?.id]);

    

    return { questions, title }
}