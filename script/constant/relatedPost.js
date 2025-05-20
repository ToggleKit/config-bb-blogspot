const postPageSure = document.querySelector(`.blog-posts.hfeed.page.post`);
if (postPageSure) {
  let allPosts = [];
  let labelsOBJ = [];
  let unfilteredPosts = [];
  const relatedPostDiv = document.querySelector(`#related-posts`);
  const eachRelatedPost = document.createElement(`div`);
  let labelsTxt = document.querySelectorAll(`.label_name`);

  labelsTxt.forEach(labelTxt => {
    labelsOBJ.push(labelTxt.textContent);
  });

  let fetchCount = 0; // Track number of API calls
  const totalLabels = labelsOBJ.length; // Total requests expected

  // Define the callback function globally
  window.relatedPosts = function (json) {
    if (json.feed?.entry) {
      json.feed.entry.forEach(postIndu => {
        unfilteredPosts.push({
          title: postIndu.title.$t,
          img: postIndu.media$thumbnail?.url || '',
          href: postIndu.link[postIndu.link.length - 1].href
        });
      });

      allPosts.push(json.feed.entry);
    }

    fetchCount++; // Increment counter after each API call

    if (fetchCount === totalLabels) {
      filterUniquePosts(); // Run filtering once all API calls complete
    }
  };

  for (let labelTxt of labelsOBJ) {
    let apiUrl = `/feeds/posts/default/-/${labelTxt}?alt=json-in-script`;

    function fetchJSONP(url, callbackName) {
      const script = document.createElement("script");
      script.src = `${url}&callback=${callbackName}`;
      document.body.appendChild(script);
    }

    fetchJSONP(apiUrl, "relatedPosts"); // Now it can find relatedPosts
  }

  // Function to filter unique posts after all API requests complete
  function filterUniquePosts() {
    let currentURL = window.location.href;
    if (currentURL.endsWith('?m=1')) {
      currentURL = currentURL.replace(`?m=1`,``);
    }

    const uniquePosts = unfilteredPosts.reduce((acc, post) => {
      if (!acc.some(existingPost => existingPost.href === post.href) && post.href !== currentURL) {
        acc.push(post);
      }
      return acc;
    }, []);

    function getRandomPosts(posts, count = 3) {
      return posts
        .sort(() => Math.random() - 0.5) // Shuffle array randomly
        .slice(0, count); // Pick first 'count' elements
    }

    const randomPosts = getRandomPosts(uniquePosts, 3);

    for (let postObj of randomPosts) {
      let imgSrc = postObj.img.replace(`/s72-h400-c`, `/h180`);
      eachRelatedPost.innerHTML += `<a href='${postObj.href}'><img src='${imgSrc}' alt='${postObj.title}' height='180'/> <h3>${postObj.title}</h3></a>`;
    }

    relatedPostDiv.appendChild(eachRelatedPost);
  }
}
