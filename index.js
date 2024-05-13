
const apiKey = '9b9243db9e1283068ea9874cb17d1ac1';

document.addEventListener('DOMContentLoaded', function () {
    let embedFrame = document.getElementById('embedFrame');

    // Function to parse URL parameters
    function getUrlParams() {
        let params = {};
        let url = new URL(window.location.href);
        url.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    // Get type and id from URL parameters
    let { type, id, season, episode } = getUrlParams();

    let apiUrl = '';
    let title = '';
    let thumbnailUrl = '';

    if (type === 'movie') {
        apiUrl = `https://vidsrctoapi.vercel.app/${id}`;
        title = 'Movie Title';
        thumbnailUrl = `https://via.placeholder.com/500x750?text=Movie+Poster`;
    } else if (type === 'tv') {
        apiUrl = `https://vidsrctoapi.vercel.app/${id}/${season}/${episode}`;
        title = 'TV Series Title';
        thumbnailUrl = `https://via.placeholder.com/500x750?text=TV+Series+Poster`;
    }

    fetch(apiUrl)
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
                        description: '',
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
                const iconPath = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PHBhdGggZD0iTTMgMTloMTh2Mkgzdi0yem0xMC01LjgyOEwxOS4wNzEgNy4xbDEuNDE0IDEuNDE0TDEyIDE3IDMuNTE1IDguNTE1IDQuOTI5IDcuMSAxMSAxMy4xN1YyaDJ2MTEuMTcyeiIgZmlsbD0icmdiYSgyNDcsMjQ3LDI0NywxKSIvPjwvc3ZnPg==";
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
                spacer.before(timeSlider);

                // Create and append the download button
                const downloadButton = document.createElement("button");
                downloadButton.id = buttonId;
                downloadButton.className = "jw-button jw-icon jw-icon-download jw-button-color jw-reset";
                downloadButton.title = tooltipText;
                downloadButton.onclick = buttonClickAction;
                buttonContainer.appendChild(downloadButton);
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
        });
});
