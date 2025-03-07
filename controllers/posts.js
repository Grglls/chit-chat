const Post = require('../models/post');

module.exports = {
  index,
  show,
  new: newPost,
  create,
  delete: deletePost,
  edit,
  update
};

async function index(req, res) {
  const posts = await Post.find({});
  res.render('posts/index', { title: 'All Posts', posts });
}

async function show(req, res) {
  // Find the post and populate the comments:
  const post = await Post.findById(req.params.id);
  res.render('posts/show', { title: 'Post Details', post });
}

function newPost(req, res) {
  // errorMsg if the create action fails
  res.render('posts/new', { title: 'New Post', errorMsg: ''});
}

async function create(req, res) {
  console.log(req.body.postContent);
  // Add the user information:
  req.body.postAuthor = req.user._id;
  req.body.postAuthorName = req.user.name;
  req.body.postAuthorAvatar = req.user.avatar;

  try {
    const post = await Post.create(req.body);
    // Redirect to the new posts show functionality:
    res.redirect(`/posts/${ post._id }`);
  } catch (err) {
    // Give error message if unsuccesful:
    console.log(err);
    res.render('posts/new', { errorMsg: err.message, title: 'Error' });
  }
}

async function deletePost(req, res) {
  const post = await Post.findById(req.params.id);
  
  // Allow only the user who created the post to delete it:
  if (!req.user._id.equals(post.postAuthor)) {
    console.log('This user did not create the post...');
    return res.redirect('/posts');
  }
  
  try {
    await Post.findByIdAndDelete(req.params.id);
    // Redirect after CRUDing data:
    res.redirect('/posts');
  } catch (err) {
    console.log(err);
  }
}

async function edit(req, res) {
  const post = await Post.findById(req.params.id);
  
  // Allow only the user who created the post to see the edit page:
  if (!req.user._id.equals(post.postAuthor)) {
    console.log('This user did not create the post...');
    return res.redirect('/posts');
  }
  
  // Render the prefilled form:
  res.render('posts/edit', {
    title: 'Edit Post',
    post
  });
}

async function update(req, res) {
  const post = await Post.findById(req.params.id);
  post.postContent = req.body.postContent;
  
  // Allow only the user who created the post to update it:
  if (!req.user._id.equals(post.postAuthor)) {
    console.log('This user did not create the post...');
    return res.redirect('/posts');
  }

  try {
    await post.save();
    
    // Redirect after CRUDing data:
    res.redirect(`/posts/${ req.params.id }`);
  } catch (err) {
    console.log(err);
  }
}
