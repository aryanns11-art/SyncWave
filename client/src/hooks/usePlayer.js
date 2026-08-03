import { useState, useRef } from "react";

function usePlayer(songs = []) {

    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);

    const audioRef = useRef(new Audio());

    const togglePlayPause = () => {

        if (!currentSong) return;

        if (isPlaying) {

            audioRef.current.pause();
            setIsPlaying(false);

        } else {

            audioRef.current.play();
            setIsPlaying(true);

        }

    };

    const handleVolumeChange = (event) => {

        const newVolume = Number(event.target.value);

        setVolume(newVolume);

        audioRef.current.volume = newVolume;

    };

    const handleSeek = (event) => {

        const seekTime = Number(event.target.value);

        audioRef.current.currentTime = seekTime;

        setCurrentTime(seekTime);

    };

    const handleSongSelect = async (selectedSong, index) => {
        
        if (!selectedSong) return;
        
        // Prevent selecting the same song again
        if (currentSong?.id === selectedSong.id) {
            return;
        }
    
        setCurrentSong(selectedSong);
    
        setCurrentIndex(index);
    
        setCurrentTime(0);
    
        setDuration(0);
    
        const audio = audioRef.current;
    
        audio.pause();
    
        audio.src = selectedSong.file;
    
        audio.load();
    
        audio.volume = volume;
    
        audio.onloadedmetadata = () => {
        
            setDuration(audio.duration);
        
        };
    
        audio.ontimeupdate = () => {
        
            setCurrentTime(audio.currentTime);
        
        };
    
        audio.onended = () => {
        
            playNextSong(index);
        
        };
    
        try {
        
            await audio.play();
        
            setIsPlaying(true);
        
        }
    
        catch (error) {
        
            console.error(error);
        
        }
    
    };

    const playNextSong = (index) => {

        const nextIndex = index + 1;

        if (nextIndex < songs.length) {

            handleSongSelect(
                songs[nextIndex],
                nextIndex
            );

        }

        else {

            audioRef.current.pause();

            setCurrentSong(null);
            setCurrentIndex(-1);

            setCurrentTime(0);

            setDuration(0);

            setIsPlaying(false);

        }

    };

    const handleNext = () => {

        const nextIndex = currentIndex + 1;

        if (nextIndex < songs.length) {

            handleSongSelect(
                songs[nextIndex],
                nextIndex
            );

        }

    };

    const playPreviousSong = () => {

        const previousIndex = currentIndex - 1;

        if (previousIndex >= 0) {

            handleSongSelect(
                songs[previousIndex],
                previousIndex
            );

        }

    };

    return {

        currentSong,

        currentIndex,

        isPlaying,

        currentTime,

        duration,

        volume,

        audioRef,

        handleSongSelect,

        togglePlayPause,

        handleSeek,

        handleNext,

        playPreviousSong,

        handleVolumeChange,

    };

}

export default usePlayer;