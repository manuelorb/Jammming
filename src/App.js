import React, {useState, useEffect} from 'react';
import './App.css';
import Playlist from './components/Playlist';
import SearchBar from './components/SearchBar';
import TrackList from './components/TrackList';
import {getSpotifyAuthUrl, getAccessTokenFromUrl, searchSpotify} from './components/SpotifyAuth';
import UserPlaylists from './components/UserPlaylists';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedUserPlaylist, setSelectedUserPlaylist] = useState(null);
  const [playlistUpdated, setPlaylistUpdated] = useState(false);



  // Get spotify token when page loads
  useEffect(() => {
    const timeout = setTimeout(() => {
      const token = getAccessTokenFromUrl();
      if (token) {
        setAccessToken(token);
        window.history.pushState({}, null, "/");
      }
    }, 100); // 100ms delay
  
    return () => clearTimeout(timeout); // clean up on unmount
  }, []);

  //Load Users Playlists
  useEffect(() => {
    if (!accessToken) return; // Don't fetch if user isn't logged in

    const fetchUserPlaylists = async () => {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await response.json();
            setUserPlaylists(data.items); // Store playlists in state
        } catch (error) {
            console.error("Error fetching user playlists:", error);
        }
    };

    fetchUserPlaylists();
}, [accessToken, playlistUpdated]);


  // Search for songs on Spotify
  async function handleSearch(query) {
    if (!accessToken) {
        alert("Please log in to Spotify first.");
        return;
    }
    const results = await searchSpotify(query, accessToken);
    setSearchResults(results);
  };
  
  // Add song to  playlist
  function addToPlaylist(track) {
    setPlaylistTracks([...playlistTracks, track]);
  };

  // Remove song from playlist
  function removeFromPlaylist(trackID) {
    setPlaylistTracks(playlistTracks.filter(track => track.id !== trackID));
  };

  // Load user playlist on to Playlist component
  const fetchPlaylistTracks = async (playlistId) => {
    if (!accessToken) return;

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const data = await response.json();
        //console.log("Fetched Playlist Data:", data);

        if (!data.tracks || !data.tracks.items) {
            console.error("No tracks found in playlist response:", data);
            setPlaylistTracks([]); // Empty if no tracks
            return;
        }

        const tracks = data.tracks.items.map(item => {
            if (!item.track) return null; // Avoid errors if track is missing
            return {
                id: item.track.id,
                name: item.track.name,
                artists: item.track.artists,
                album: item.track.album,
                uri: item.track.uri
            };
        }).filter(track => track !== null); // Remove null values

        setPlaylistTracks(tracks);
    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
    }
  };

  const handlePlaylistClick = (playlist) => {
    setPlaylistName(playlist.name);
    setSelectedUserPlaylist(playlist);
    fetchPlaylistTracks(playlist.id);
  };

  // Clear UserSelectedPlaylist so you can make a new one.
  const startNewPlaylist = () => {
    setPlaylistName(null);
    setPlaylistTracks([]);
    setSelectedUserPlaylist(null);
  };

  // Save playlist to spotify
  async function saveToSpotify() {
    if (!accessToken || playlistTracks.length === 0) {
        alert("Please log in and add songs to your playlist.");
        return;
    }

    try {
        let playlistId;

        // Check if editing an existing playlist
        if (selectedUserPlaylist) {
            playlistId = selectedUserPlaylist.id;
        } else {
            // Fetch the user's ID
            const userResponse = await fetch(`https://api.spotify.com/v1/me`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userData = await userResponse.json();
            const userId = userData.id;

            // Create a new playlist
            const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: playlistName, // This is a string, so it's fine here
                    description: "Created with Jammming!",
                    public: true
                })
            });

            const newPlaylist = await createResponse.json();
            playlistId = newPlaylist.id;
        }

        // Add tracks to the playlist
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris: playlistTracks.map(track => track.uri)
            })
        });

        alert("Playlist saved successfully!");
        setPlaylistUpdated(prev => !prev);
    } catch (error) {
        console.error("Error saving playlist:", error);
        alert("There was an issue saving your playlist.");
    }
};



  return (
    <div className="App">
      <header className="App-header">
        <h1>Ja<span className="purpleM">mmm</span>ing</h1>
        <SearchBar 
          onSearch={handleSearch} />
      </header>
      <main>
        {!accessToken ? (
          <div class="logIn-container">
            <button
              onClick={() => window.location.href = getSpotifyAuthUrl()}
              id="logIn"
            >Log in to Spotify</button>
          </div>
        ) : (
          <>
            <div id="boxGrid">
              <div id="results">
                <TrackList 
                  searchResults={searchResults} 
                  addToPlaylist={addToPlaylist} />
              </div>
              <div id="playlist">
                <Playlist 
                  playlistTracks={playlistTracks}
                  removeFromPlaylist={removeFromPlaylist}
                  playlistName={playlistName || ''}
                  setPlaylistName={(name) => setPlaylistName(name)}
                  saveToSpotify={saveToSpotify}
                  startNewPlaylist={startNewPlaylist} />
              </div>
            </div>
            <UserPlaylists 
              playlists={userPlaylists}
              onPlaylistClick={handlePlaylistClick} 
            />
          </>
        )}
      </main>
    </div>
  );
};

export default App;