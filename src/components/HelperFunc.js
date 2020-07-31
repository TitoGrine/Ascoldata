export const keyBinds = [ 'Unknown', 'C', 'C♯, D♭', 'D', 'D♯, E♭', 'E', 'F', 'F♯, G♭', 'G', 'G♯, A♭', 'A', 'A♯, B♭', 'B' ];

export const formatDuration = (duration_ms) => {
    let seconds = Math.round(duration_ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    return hours === 0
        ? ('00' + minutes).slice(-2) + ':' + ('00' + seconds % 60).slice(-2)
        : hours + 'h ' + ('00' + minutes % 60).slice(-2) + 'min';
};