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

    const formatTime = (time) => {

        if (isNaN(time)) return "0:00";

        const minutes = Math.floor(time / 60);

        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;

    };

    const handleSongSelect = (selectedSong, index) => {

        setCurrentSong(selectedSong);

        setCurrentIndex(index);

        setCurrentTime(0);

        setDuration(0);

        setIsPlaying(true);

        audioRef.current.pause();

        audioRef.current.src = selectedSong.file;

        audioRef.current.load();

        audioRef.current.play();

        audioRef.current.onloadedmetadata = () => {

            setDuration(audioRef.current.duration);

        };

        audioRef.current.ontimeupdate = () => {

            setCurrentTime(audioRef.current.currentTime);

        };

        audioRef.current.onended = () => {

            playNextSong(index);

        };

    };


    const playNextSong = (index) => {

        const nextIndex = index + 1;

        if (nextIndex < songs.length) {

            handleSongSelect(
                songs[nextIndex],
                nextIndex
            );

        } else {

            setIsPlaying(false);

            setCurrentSong(null);

            setCurrentIndex(-1);

            setCurrentTime(0);

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
    setCurrentSong,

    currentIndex,
    setCurrentIndex,

    isPlaying,
    setIsPlaying,

    currentTime,
    setCurrentTime,

    duration,
    setDuration,

    volume,
    setVolume,

    audioRef,

    togglePlayPause,
    handleVolumeChange,
    handleSeek,

    formatTime,
    playNextSong,
    handleSongSelect,

    handleNext,
    playPreviousSong,
};

}

export default usePlayer;