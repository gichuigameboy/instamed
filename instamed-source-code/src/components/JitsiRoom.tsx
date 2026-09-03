import { Video } from 'lucide-react';

interface JitsiRoomProps {
    jitsiUrl: string;
    roomName: string;
}

export function JitsiRoom({ jitsiUrl, roomName }: JitsiRoomProps) {
    return (
        <div className="w-full h-full relative bg-black rounded-xl overflow-hidden">
            <iframe
                src={jitsiUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
                title={`Video call: ${roomName}`}
            />
        </div>
    );
}
