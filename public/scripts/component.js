//CommentBox component
var CommentBox = React.createClass({
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
    getInitialState: function(){
        return {data: []};
    },
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer,
        this.props.pollInterval);
    },
    render: function(){
        return(
            <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList data={this.state.data}/> //receive data
                    <CommentForm />
            </div>
        );
    }
});

//Commentlist and Form component
var CommentList = React.createClass({
    render: function(){
        var commentNodes = this.props.data.map(function (comment){
            return (
                <Comment author={comment.author}>
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
    render: function(){
        return (
            <div className="commentForm">
            </div>
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
                    {this.props.author} //receive author's content from CommentList
                </h2>
                {this.props.children} // receive other nested content from CommentList
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

ReactDom.render(
    <CommentBox url="/api/comments" pollInterval={2000} />,
    document.getElementById('content')
);