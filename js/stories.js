'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
   storyList = await StoryList.getStories();
   $storiesLoadingMsg.remove();

   putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
   // console.debug("generateStoryMarkup", story);

   const hostName = story.getHostName();
   return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <small class="story-fav-button"> add to favorites</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
   console.debug('putStoriesOnPage');

   $allStoriesList.empty();

   // loop through all of our stories and generate HTML for them
   for (let story of storyList.stories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
   }

   $allStoriesList.show();
}

/** Story submission */
async function storySubmit(evt) {
   console.debug('submit', evt);
   evt.preventDefault();

   //grab story data
   const storyTitle = $('#submit-story-title').val();
   const storyURL = $('#submit-story-url').val();
   const storyAuthor = $('#submit-story-author').val();

   const newStory = {
      title: storyTitle,
      author: storyAuthor,
      url: storyURL,
   };

   await StoryList.addStory(currentUser, newStory);

   updateUIOnSubmit();
}

$submitForm.on('submit', storySubmit);

function updateUIOnSubmit() {
   console.debug('updateUIOnSubmit');

   $submitForm.hide();

   $allStoriesList.show();

   updateNavOnLogin();
   getAndShowStoriesOnStart();
}

function addStorytoFavs(evt) {
   evt.preventDefault();

   //identify story ID
   if (evt.target.className === 'story-fav-button') {
      console.debug('addStoryToFavs');
      let favStoryId = evt.target.parentElement.id;
      evt.target.parentElement.classList.toggle('story-fav');
      if (evt.target.parentElement.classList.contains('story-fav')) {
         evt.target.innerText = 'remove from favorites';
      } else {
         evt.target.innerText = 'add to favorites';
      }
      currentUser.addToFavorites(favStoryId);
   }
}

$allStoriesList.on('click', addStorytoFavs);
