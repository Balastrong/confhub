import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { SignedIn } from "~/components/auth/signed-in"
import { SignedOut } from "~/components/auth/signed-out"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { formatDateTime } from "~/lib/date"
import {
  authQueries,
  commentQueries,
  useCreateEventCommentMutation,
  useDeleteEventCommentMutation,
} from "~/services/queries"
import { ButtonLink } from "../button-link"

export function EventComments({ eventId }: { eventId: number }) {
  const { data: comments } = useQuery(commentQueries.listByEvent(eventId))
  const { data: session } = useQuery(authQueries.user())
  const [text, setText] = useState("")
  const max = 500
  const createComment = useCreateEventCommentMutation()
  const deleteComment = useDeleteEventCommentMutation()
  const currentUserId = session?.user?.id as string | undefined

  const submit = async () => {
    const content = text.trim()
    if (!content || createComment.isPending) return
    await createComment.mutateAsync({ data: { eventId, content } })
    setText("")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit()
  }

  return (
    <div className="space-y-4">
      <SignedIn>
        <form onSubmit={onSubmit} className="space-y-2">
          <label htmlFor="comment" className="sr-only">
            Add a comment
          </label>
          <Textarea
            id="comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                void submit()
              }
            }}
            placeholder="Share your thoughts about this event..."
            maxLength={max}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {text.trim().length} / {max}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={text.trim().length === 0 || createComment.isPending}
            >
              {createComment.isPending ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>
      </SignedIn>

      <SignedOut>
        <div className="text-sm text-muted-foreground">
          <span>You must be signed in to leave a comment. </span>
          <ButtonLink to="/sign-in" variant="link" size="sm">
            Sign in
          </ButtonLink>
        </div>
      </SignedOut>

      <ThreadedComments
        comments={comments || []}
        eventId={eventId}
        createComment={createComment}
        deleteComment={deleteComment}
        currentUserId={currentUserId}
      />
    </div>
  )
}

type CommentItem = {
  id: string
  eventId: number
  userId: string
  content: string
  rating: number | null
  parentId: string | null
  createdAt: Date | string
  updatedAt: Date | string
  authorName: string | null
  authorImage: string | null
}

type TreeComment = CommentItem & { replies: TreeComment[] }

function buildTree(list: CommentItem[]): TreeComment[] {
  const map = new Map<string, TreeComment>()
  const roots: TreeComment[] = []
  for (const c of list) {
    map.set(c.id, { ...c, replies: [] })
  }
  for (const c of list) {
    const node = map.get(c.id)!
    if (c.parentId) {
      const parent = map.get(c.parentId)
      if (parent) parent.replies.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

function ThreadedComments({
  comments,
  eventId,
  createComment,
  deleteComment,
  currentUserId,
}: {
  comments: CommentItem[]
  eventId: number
  createComment: ReturnType<typeof useCreateEventCommentMutation>
  deleteComment: ReturnType<typeof useDeleteEventCommentMutation>
  currentUserId?: string
}) {
  const tree = useMemo(() => buildTree(comments), [comments])
  return (
    <div className="space-y-3">
      {tree.length ? (
        tree.map((c) => (
          <CommentNode
            key={c.id}
            node={c}
            eventId={eventId}
            createComment={createComment}
            deleteComment={deleteComment}
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No comments yet.</p>
      )}
    </div>
  )
}

function CommentNode({
  node,
  eventId,
  createComment,
  deleteComment,
  currentUserId,
}: {
  node: TreeComment
  eventId: number
  createComment: ReturnType<typeof useCreateEventCommentMutation>
  deleteComment: ReturnType<typeof useDeleteEventCommentMutation>
  currentUserId?: string
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const max = 500
  const submitReply = async () => {
    const content = replyText.trim()
    if (!content || createComment.isPending) return
    await createComment.mutateAsync({
      data: { eventId, content, parentId: node.id },
    })
    setReplyText("")
    setReplyOpen(false)
  }
  const onReply = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitReply()
  }

  const isOwner = currentUserId && node.userId === currentUserId
  const onDelete = async () => {
    // Basic confirm to prevent accidental deletes
    if (!isOwner) return
    const confirmed = window.confirm("Delete this comment?")
    if (!confirmed) return
    await deleteComment.mutateAsync({ data: { id: node.id } })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={node.authorImage || ""}
            alt={node.authorName || ""}
          />
          <AvatarFallback>
            {(node.authorName || "?").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="text-sm font-medium">
            {node.authorName || "Anonymous"}
          </div>
          <div className="text-xs text-muted-foreground mb-1">
            {formatDateTime(new Date(node.createdAt))}
          </div>
          <div className="text-sm whitespace-pre-wrap">{node.content}</div>
          <SignedIn>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:underline mt-1"
              onClick={() => setReplyOpen((v) => !v)}
            >
              {replyOpen ? "Cancel" : "Reply"}
            </button>
            {isOwner ? (
              <>
                <span className="mx-2 text-muted-foreground">·</span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline mt-1"
                  onClick={onDelete}
                  disabled={deleteComment.isPending}
                >
                  {deleteComment.isPending ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : null}
          </SignedIn>
        </div>
      </div>
      {replyOpen && (
        <form onSubmit={onReply} className="ml-11 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                void submitReply()
              }
            }}
            placeholder="Write a reply..."
            maxLength={max}
            className="min-h-[80px]"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {replyText.trim().length} / {max}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={
                replyText.trim().length === 0 || createComment.isPending
              }
            >
              {createComment.isPending ? "Replying..." : "Reply"}
            </Button>
          </div>
        </form>
      )}
      {node.replies.length > 0 && (
        <div className="ml-11 space-y-3">
          {node.replies.map((r) => (
            <CommentNode
              key={r.id}
              node={r}
              eventId={eventId}
              createComment={createComment}
              deleteComment={deleteComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
