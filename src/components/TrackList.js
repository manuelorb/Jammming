

function TrackList({searchResults, addToPlaylist}) {
    //console.log(searchResults);
    return (
        <div>
            <h2>Results</h2>
            {searchResults.length > 0 ? (
                searchResults.map(track => (
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
                            <p onClick={() => addToPlaylist(track)}>+</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Search for a song</p>
            )}
        </div>
    );
}

export default TrackList