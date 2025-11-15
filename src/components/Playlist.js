import styles from './Playlist.module.css';

function Playlist({playlistTracks, removeFromPlaylist, playlistName, setPlaylistName, saveToSpotify, startNewPlaylist}) {
    return(
        <div>
            <input 
                type="text"
                id="playlistName"
                value={playlistName || ''}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className={styles.form__field}
            ></input>
            {playlistTracks.length > 0 ? (
                playlistTracks.map(track => (
                    <div key={track.id} className="track">
                        <div className="inline">
                            {track.album.images[0] ? (
                                <img 
                                    src={track.album.images[0].url}
                                    alt="note"></img>
                            ) : (
                                <img 
                                    src={require('./images/music-note.png')}
                                    alt="note"></img>
                            )} 
                            <div>
                                <h3>{track.name}</h3>
                                <p>{track.artists.map(artist => artist.name).join(', ')} - {track.album.name}</p>
                            </div>
                        </div>
                        <div className="button">
                            <p onClick={() => removeFromPlaylist(track.id)}>-</p>
                        </div>
                    </div>
                ))
            ) : (
                    <p>Add songs...</p>
            )}
            {playlistTracks.length > 0 && <button onClick={saveToSpotify} disabled={playlistTracks.length === 0} >Save to Spotify</button>}
            {playlistName && <button onClick={startNewPlaylist} className="startNewPlaylist">Start new playlist</button>}
        </div>
    )
};

export default Playlist