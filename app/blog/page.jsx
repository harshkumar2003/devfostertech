import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Search } from "lucide-react";
import Card from "@/components/Card";

export default async function Blog() {
  const supabase = createServerComponentClient({ cookies });

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error.message);
  }

  return (
    <div className="p-8">
      <div className="pt-24 text-white text-center">
        <h1 className="text-8xl sm:text-4xl text-[#6CDDC2]">
          Fostering Digital Innovation
        </h1>
        <p className="text-3xl sm:text-xl pt-4">
          Explore cutting-edge insights, expert tutorials, and industry trends
          that drive business growth through technology.
        </p>
      </div>

      <div className="pt-8">
        <div className="flex justify-center">
          <div className="relative mt-2 w-full max-w-md">
            <Search className="text-white w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search Article"
              className="pl-10 pr-4 rounded-full bg-transparent border border-[#6CDDC2] py-2 w-full placeholder:text-white text-white outline-none text-center caret-[#6CDDC2]"
            />
          </div>
        </div>

        <h1 className="text-[#6CDDC2] font-bold text-xl pt-10">
          Featured Articles
        </h1>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card
                title={post.title}
                description={post.content.slice(0, 100)}
                image={post.image_url}
                tags={post.tags}
                date={post.created_at}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
