


function UserPlaylists({ playlists , onPlaylistClick }) {
    //console.log(playlists);
    return (
        <>
            <h2>Your Playlists</h2>
            <div className="userPlaylistsContainer">
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <div key={playlist.id} className="playlist" onClick={() => onPlaylistClick(playlist)} >
                            {playlist.images.length > 0 ? (
                                <img 
                                    src={playlist.images[0].url}
                                    alt="note"></img>
                            ) : (
                                <img 
                                    src={require('./images/music-note.png')}
                                    alt="note"></img>
                            )}
                            <h3>{playlist.name}</h3>
                        </div>
                    ))
                ) : (
                    <p>No playlists found.</p>
                )}
            </div>
        </>
    );
}

export default UserPlaylists;
