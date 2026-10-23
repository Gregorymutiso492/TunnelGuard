const express = require('express');
const router = express.Router();

const socialPlatforms = [
  { name: 'Facebook', url: 'https://facebook.com' },
  { name: 'Instagram', url: 'https://instagram.com' },
  { name: 'Twitter', url: 'https://x.com' },
  { name: 'TikTok', url: 'https://tiktok.com' },
  { name: 'Snapchat', url: 'https://snapchat.com' },
  { name: 'Reddit', url: 'https://reddit.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Pinterest', url: 'https://pinterest.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'WhatsApp', url: 'https://whatsapp.com' },
  { name: 'Telegram', url: 'https://telegram.org' },
  { name: 'Discord', url: 'https://discord.com' },
  { name: 'Spotify', url: 'https://spotify.com' },
  { name: 'Netflix', url: 'https://netflix.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Dribbble', url: 'https://dribbble.com' },
  { name: 'Behance', url: 'https://behance.net' },
  { name: 'Vimeo', url: 'https://vimeo.com' },
  { name: 'Medium', url: 'https://medium.com' },
  { name: 'Tumblr', url: 'https://tumblr.com' },
  { name: 'Quora', url: 'https://quora.com' },
  { name: 'Flickr', url: 'https://flickr.com' },
  { name: 'SoundCloud', url: 'https://soundcloud.com' },
  { name: 'DeviantArt', url: 'https://deviantart.com' },
  { name: 'Twitch', url: 'https://twitch.tv' },
  { name: 'Kik', url: 'https://www.kik.com/' },
  { name: 'Clubhouse', url: 'https://www.clubhouse.com/' },
  { name: 'Mastodon', url: 'https://mastodon.social/' },
  { name: 'Threads', url: 'https://www.threads.net/' },
  { name: 'VK', url: 'https://vk.com' },
  { name: 'Discord', url: 'https://discord.com' },
  { name: 'Hootsuite', url: 'https://hootsuite.com/' },
  { name: 'Buffer', url: 'https://buffer.com/' },
  { name: 'Canva', url: 'https://www.canva.com/' },
  { name: 'Slack', url: 'https://slack.com' },
  { name: 'Meetup', url: 'https://www.meetup.com/' },
  { name: 'Nextdoor', url: 'https://nextdoor.com/' },
  { name: 'Badoo', url: 'https://badoo.com/' },
  { name: 'Mighty Networks', url: 'https://www.mightynetworks.com/' },
  { name: 'Substack', url: 'https://substack.com/' },
  { name: 'Flipboard', url: 'https://flipboard.com/' },
  { name: 'Giphy', url: 'https://giphy.com/' },
  { name: 'Imgur', url: 'https://imgur.com/' },
  { name: 'Xbox', url: 'https://www.xbox.com/' },
  { name: 'Steam', url: 'https://store.steampowered.com/' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/' },
  { name: 'Cricbuzz', url: 'https://www.cricbuzz.com/' },
  { name: 'Wattpad', url: 'https://www.wattpad.com/' },
  { name: 'Goodreads', url: 'https://www.goodreads.com/' },
  { name: 'Sketch', url: 'https://www.sketch.com/' }
];

const businessSites = [
  { name: 'PayPal', url: 'https://paypal.com' },
  { name: 'Amazon', url: 'https://amazon.com' },
  { name: 'eBay', url: 'https://ebay.com' },
  { name: 'Shopify', url: 'https://shopify.com' },
  { name: 'Zoom', url: 'https://zoom.us' },
  { name: 'Slack', url: 'https://slack.com' },
  { name: 'Trello', url: 'https://trello.com' },
  { name: 'Asana', url: 'https://asana.com' },
  { name: 'Notion', url: 'https://notion.so' },
  { name: 'Dropbox', url: 'https://dropbox.com' },
  { name: 'Google Workspace', url: 'https://workspace.google.com' },
  { name: 'Microsoft 365', url: 'https://www.microsoft.com/en-us/microsoft-365' },
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'Square', url: 'https://squareup.com' },
  { name: 'QuickBooks', url: 'https://quickbooks.intuit.com' },
  { name: 'HubSpot', url: 'https://hubspot.com' },
  { name: 'Mailchimp', url: 'https://mailchimp.com' },
  { name: 'Salesforce', url: 'https://salesforce.com' },
  { name: 'Zapier', url: 'https://zapier.com' },
  { name: 'Monday.com', url: 'https://monday.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Upwork', url: 'https://upwork.com' },
  { name: 'Fiverr', url: 'https://fiverr.com' },
  { name: 'Indeed', url: 'https://indeed.com' },
  { name: 'Glassdoor', url: 'https://glassdoor.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'GitLab', url: 'https://gitlab.com' },
  { name: 'Bitbucket', url: 'https://bitbucket.org' },
  { name: 'Adobe Creative Cloud', url: 'https://www.adobe.com/creativecloud.html' },
  { name: 'Canva', url: 'https://www.canva.com/' },
  { name: 'DocuSign', url: 'https://docusign.com' },
  { name: 'ZoomInfo', url: 'https://www.zoominfo.com/' },
  { name: 'FreshBooks', url: 'https://www.freshbooks.com/' },
  { name: 'Xero', url: 'https://www.xero.com/' },
  { name: 'Calendly', url: 'https://calendly.com/' },
  { name: 'Webflow', url: 'https://webflow.com/' },
  { name: 'Wix', url: 'https://www.wix.com/' },
  { name: 'Shopify', url: 'https://shopify.com/' },
  { name: 'BigCommerce', url: 'https://www.bigcommerce.com/' },
  { name: 'Airbnb', url: 'https://www.airbnb.com/' },
  { name: 'Expedia', url: 'https://www.expedia.com/' },
  { name: 'Uber', url: 'https://www.uber.com/' }
];

const otherSites = [
  { name: 'Coursera', url: 'https://coursera.org' },
  { name: 'edX', url: 'https://edx.org' },
  { name: 'Khan Academy', url: 'https://khanacademy.org' },
  { name: 'Udemy', url: 'https://udemy.com' },
  { name: 'The Guardian', url: 'https://theguardian.com' },
  { name: 'BBC', url: 'https://bbc.com' },
  { name: 'CNN', url: 'https://cnn.com' },
  { name: 'Netflix', url: 'https://netflix.com' },
  { name: 'Hulu', url: 'https://hulu.com' },
  { name: 'Disney+', url: 'https://disneyplus.com' },
  { name: 'Prime Video', url: 'https://primevideo.com' },
  { name: 'Spotify', url: 'https://spotify.com' },
  { name: 'Apple Music', url: 'https://music.apple.com' },
  { name: 'YouTube', url: 'https://youtube.com' },
  { name: 'Spotify Podcasts', url: 'https://podcasters.spotify.com/' },
  { name: 'BBC iPlayer', url: 'https://www.bbc.co.uk/iplayer' },
  { name: 'Wikipedia', url: 'https://wikipedia.org' },
  { name: 'Google', url: 'https://www.google.com/' },
  { name: 'Weather', url: 'https://weather.com/' },
  { name: 'Maps', url: 'https://maps.google.com/' }
];

router.get('/social-platforms', (req, res) => {
  res.json(socialPlatforms);
});

router.get('/business-sites', (req, res) => {
  res.json(businessSites);
});

router.get('/other-sites', (req, res) => {
  res.json(otherSites);
});

router.get('/redirect/:name', (req, res) => {
  const target = [...socialPlatforms, ...businessSites, ...otherSites].find(site => site.name.toLowerCase() === req.params.name.toLowerCase());

  if (!target) {
    return res.status(404).json({ message: 'Site not found.' });
  }

  res.redirect(target.url);
});

module.exports = router;
