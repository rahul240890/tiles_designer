"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PageContainer from "@/app/components/container/PageContainer";
import { TileCollection } from "../../api/types";
import { getCollections, deleteCollection } from "../../api/collection";

const CollectionList = () => {
  const [collections, setCollections] = useState<TileCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      try {
        await deleteCollection(id);
        setCollections(collections.filter((collection) => collection.id !== id));
      } catch (error) {
        console.error("Failed to delete collection:", error);
      }
    }
  };

  return (
    <PageContainer title="Collections" description="Manage tile collections">
      <Typography variant="h4" gutterBottom>
        Tile Collections
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push("/company/collections/add")}>
        Add Collection
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Finish</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>{collection.id}</TableCell>
                  <TableCell>{collection.name}</TableCell>
                  <TableCell>{collection.category_id}</TableCell>
                  <TableCell>{collection.size_id}</TableCell>
                  <TableCell>{collection.material_id}</TableCell>
                  <TableCell>{collection.finish_id}</TableCell>
                  <TableCell>{collection.description || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => router.push(`/company/collections/edit/${collection.id}`)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(collection.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default CollectionList;
