import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link2, Camera } from "lucide-react";
import type { SocialPost } from "@/lib/social/mock-feeds";

interface FeedCardProps {
  post: SocialPost;
}

export function FeedCard({ post }: FeedCardProps) {
  const isLinkedin = post.platform === "linkedin";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
              isLinkedin ? "bg-blue-600/20" : "bg-pink-600/20"
            }`}
          >
            {isLinkedin ? (
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-pink-400" />
            )}
          </div>
          <span className="text-white text-sm font-medium truncate">
            {post.businessUnit}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={isLinkedin ? "default" : "muted"}>
            {post.platform}
          </Badge>
          <a
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <p className="text-zinc-300 text-sm leading-relaxed line-clamp-4">
        {post.content}
      </p>

      <p className="text-zinc-600 text-xs mt-3">
        {new Date(post.postedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
