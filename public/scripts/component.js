//CommentBox
var CommentBox = React.createClass({
    render: function(){
        return(
            <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList />
                    <CommentForm />
            </div>
        );
    }
});

//Commentlist and Form
var CommentList = React.createClass({
    render: function(){
        return(
            <div className="Commentlist">
                <Comment author="Steve">This is the first comment</Comment>
                <Comment author="Jack">This is another comment</Comment>
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
//CommentAuthor
var Comment = React.createClass({
    render: function(){
        return(
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

ReactDom.render(
    <CommentBox />,
    document.getElementById('content')
);