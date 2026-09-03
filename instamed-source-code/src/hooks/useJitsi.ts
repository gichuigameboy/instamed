export function useJitsi(appointmentId: string, displayName: string) {
    const roomName = `instamed-${appointmentId}`;
    const domain = 'meet.jit.si';

    // Build Jitsi URL with prefilled config via hash params
    const params = new URLSearchParams({
        userInfo: JSON.stringify({ displayName }),
    });

    const jitsiUrl = `https://${domain}/${roomName}#${params.toString()}`;

    return { roomName, domain, jitsiUrl };
}
