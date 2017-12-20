//CommentBox component
var CommentBox = React.createClass({
    //AJAX get request to fetch data from the server
    loadCommentsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    // submit to the server and refresh the list
    handleCommentSubmit: function(comment){
        var comments = this.state.data;
        comment.id = Date.now();
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    },
    //to return the initial data nodes
    getInitialState: function(){
        return {data: []};
    },
    //to mount JSON data to the commentBox that received from the server
    componentDidMount: function(){     
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer,
        this.props.pollInterval);
    },
    render: function(){
        return(
            <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList data={this.state.data}/> // to receive the data from commentBox
                    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

//Commentlist and Form component
var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function (comment){
            return (
                <Comment author={comment.author}> key={comment.id}>
                {comment.text}
                </Comment>
            );
        });
        return(
            <div className="Commentlist">
                {commentNodes}  //source the data to CommentList
            </div>
        );
    }
});
var CommentForm = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        if (!text || !author){
            return;
        }
        // send request to the server
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },
    render: function(){
        return (
        <form className="commentForm" onSubmit={this.handleSubmit}> // created inputs to take in user input
            <input type="text" placeholder="Your name" ref="author" />
            <input type="text" placeholder="Write your comment here" ref="text" />
            <input type="submit" value="Post" />
        </form>
        );
    }
});

//Comment
var Comment = React.createClass({
    //adding markdown to prevent XSS hacks
    rawMarkup: function() {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
      },

    render: function(){
        return(
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author} // to receive author's content from CommentList
                </h2>
                {this.props.children} // to receive other nested content from CommentList
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

ReactDom.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('content')
);