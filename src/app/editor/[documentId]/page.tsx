import { Metadata } from "next";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/LoadingScreen";
import EditorView from "@/components/editor/EditorView";

export const metadata: Metadata = {
  title: "Gitdocs Editor",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface Props {
  params: Promise<{ documentId: string }>;
}

const Page = async ({ params }: Props) => {
  
  const { documentId } = await params;

  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Loading Document"
          subtitle="Please wait while we load your document"
        />
      }
    >
      <EditorView documentId={documentId} />
    </Suspense>
  );
};

export default Page;
