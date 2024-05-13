
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const season = urlParams.get('season');
const episode = urlParams.get('episode');

const apiKey = 'e5d3d2597e84c6d24ff978e781074fa8'; // Ganti dengan API key TMDB Anda
const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Movie not available');
    }
    return response.json()
  })
  .then(movieData => {
    const title = movieData.title;
    const overview = movieData.overview;
    const thumbnailUrl = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;

    const sourcesUrl = season && episode ? `https://vidsrctoapi.vercel.app/${id}/${season}/${episode}` : `https://vidsrctoapi.vercel.app/${id}`;

    fetch(sourcesUrl)
      .then(response => response.json())
      .then(data => {
        const sources = data.sources.map(source => {
          return {
            file: source.url,
            quality: source.quality,
            isM3U8: source.isM3U8
          };
        });

        const subtitles = data.subtitles.map(subtitle => {
          return {
            file: subtitle.url,
            kind: 'captions',
            label: subtitle.lang
          };
        });

        const playerInstance = jwplayer("player").setup({
          controls: true,
          sharing: false,
          displaytitle: false,
          displaydescription: true,
          abouttext: title,
          aboutlink: "W88movie",
          skin: {
            name: "netflix"
          },
          captions: {
            color: "#FFF",
            fontSize: 16,
            backgroundOpacity: 100,
            edgeStyle: "uniform"
          },
          playlist: [
            {
              title: title,
              description: overview,
              image: thumbnailUrl,
              sources: sources,
              captions: subtitles
            }
          ],
          advertising: {
            client: "vast"
          }
        });

        playerInstance.on("ready", function () {
  const buttonId = "download-video-button";
  const iconPath =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTMgMTloMTh2Mkgzdi0yem0xMC01LjgyOEwxOS4wNzEgNy4xbDEuNDE0IDEuNDE0TDEyIDE3IDMuNTE1IDguNTE1IDQuOTI5IDcuMSAxMSAxMy4xN1YyaDJ2MTEuMTcyeiIgZmlsbD0icmdiYSgyNDcsMjQ3LDI0NywxKSIvPjwvc3ZnPg==";
  const tooltipText = "Download";
  // This function is executed when the button is clicked
  function buttonClickAction() {
    const playlistItem = playerInstance.getPlaylistItem();
    const anchor = document.createElement("a");
    const fileUrl = playlistItem.file;
    anchor.setAttribute("href", fileUrl);
    const downloadName = playlistItem.file.split("/").pop();
    anchor.setAttribute("download", downloadName);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  // Move the timeslider in-line with other controls
  const playerContainer = playerInstance.getContainer();
  const buttonContainer = playerContainer.querySelector(".jw-button-container");
  const spacer = buttonContainer.querySelector(".jw-spacer");
  const timeSlider = playerContainer.querySelector(".jw-slider-time");
  // Forward 10 seconds
  const rewindContainer = playerContainer.querySelector(
    ".jw-display-icon-rewind"
  );
  const forwardContainer = rewindContainer.cloneNode(true);
  const forwardDisplayButton = forwardContainer.querySelector(
    ".jw-icon-rewind"
  );
  forwardDisplayButton.style.transform = "scaleX(-1)";
  forwardDisplayButton.ariaLabel = "Forward 10 Seconds";
  const nextContainer = playerContainer.querySelector(".jw-display-icon-next");  nextContainer.parentNode.insertBefore(forwardContainer, nextContainer);

  // control bar icon
  playerContainer.querySelector(".jw-display-icon-next").style.display = "none"; // hide next button
  const rewindControlBarButton = buttonContainer.querySelector(
    ".jw-icon-rewind"
  );
  const forwardControlBarButton = rewindControlBarButton.cloneNode(true);
  forwardControlBarButton.style.transform = "scaleX(-1)";
  forwardControlBarButton.ariaLabel = "Forward 10 Seconds";  rewindControlBarButton.parentNode.insertBefore(
    forwardControlBarButton,    rewindControlBarButton.nextElementSibling
  );
  // add onclick handlers
  [forwardDisplayButton, forwardControlBarButton].forEach((button) => {
    button.onclick = () => {     playerInstance.seek(playerInstance.getPosition() + 10);
    };
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  })
  .catch(error => {
    console.error('Error fetching movie data:', error);

    const errorImageUrl = 'https://via.placeholder.com/500x750?text=Movie+Poster+Not+Available';

    const playerInstance = jwplayer("player").setup({
      controls: true,
      sharing: false,
      displaytitle: false,
      displaydescription: true,
      abouttext: "Movie not available",
      aboutlink: "W88movie",
      skin: {
        name: "netflix"
      },
      captions: {
        color: "#FFF",
        fontSize: 16,
        backgroundOpacity: 100,
        edgeStyle: "uniform"
      },
      playlist: [
        {
          title: "Movie not available",
          description: "Sorry, the movie you requested is not available.",
          image: errorImageUrl,
          sources: [],
          captions: []
        }
      ],
      advertising: {
        client: "vast"
      }
    });

    playerInstance.on("ready", function () {
  const buttonId = "download-video-button";
  const iconPath =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTMgMTloMTh2Mkgzdi0yem0xMC01LjgyOEwxOS4wNzEgNy4xbDEuNDE0IDEuNDE0TDEyIDE3IDMuNTE1IDguNTE1IDQuOTI5IDcuMSAxMSAxMy4xN1YyaDJ2MTEuMTcyeiIgZmlsbD0icmdiYSgyNDcsMjQ3LDI0NywxKSIvPjwvc3ZnPg==";
  const tooltipText = "Download";
  // This function is executed when the button is clicked
  function buttonClickAction() {
    const playlistItem = playerInstance.getPlaylistItem();
    const anchor = document.createElement("a");
    const fileUrl = playlistItem.file;
    anchor.setAttribute("href", fileUrl);
    const downloadName = playlistItem.file.split("/").pop();
    anchor.setAttribute("download", downloadName);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  // Move the timeslider in-line with other controls
  const playerContainer = playerInstance.getContainer();
  const buttonContainer = playerContainer.querySelector(".jw-button-container");
  const spacer = buttonContainer.querySelector(".jw-spacer");
  const timeSlider = playerContainer.querySelector(".jw-slider-time");
  // Forward 10 seconds
  const rewindContainer = playerContainer.querySelector(
    ".jw-display-icon-rewind"
  );
  const forwardContainer = rewindContainer.cloneNode(true);
  const forwardDisplayButton = forwardContainer.querySelector(
    ".jw-icon-rewind"
  );
  forwardDisplayButton.style.transform = "scaleX(-1)";
  forwardDisplayButton.ariaLabel = "Forward 10 Seconds";
  const nextContainer = playerContainer.querySelector(".jw-display-icon-next");  nextContainer.parentNode.insertBefore(forwardContainer, nextContainer);

  // control bar icon
  playerContainer.querySelector(".jw-display-icon-next").style.display = "none"; // hide next button
  const rewindControlBarButton = buttonContainer.querySelector(
    ".jw-icon-rewind"
  );
  const forwardControlBarButton = rewindControlBarButton.cloneNode(true);
  forwardControlBarButton.style.transform = "scaleX(-1)";
  forwardControlBarButton.ariaLabel = "Forward 10 Seconds";  rewindControlBarButton.parentNode.insertBefore(
    forwardControlBarButton,    rewindControlBarButton.nextElementSibling
  );
  // add onclick handlers
  [forwardDisplayButton, forwardControlBarButton].forEach((button) => {
    button.onclick = () => {     playerInstance.seek(playerInstance.getPosition() + 10);
    };
    });
  });
      
