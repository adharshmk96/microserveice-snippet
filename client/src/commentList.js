import React from 'react';

export default ({comments}) => {
    
    const renderedComments = comments.map(comment => {
        let content;
        if (comment.status === 'rejected') {
            content = "Comment Rejected"
        }
        if (comment.status === 'approved') {
            content = comment.content
        }
        if (comment.status === 'pending') {
            content = "Awaiting Moderation"
        }
        return <li key={comment.id}>{content}</li>
    })
    
    return (<ul>
        {renderedComments}
    </ul>)
}