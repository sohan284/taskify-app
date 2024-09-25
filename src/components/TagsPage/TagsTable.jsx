import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
  TablePagination,
} from "@mui/material";
import PropTypes from "prop-types";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { setReloadPage } from "../../store/features/reloadSlice";
import SearchFilter from "../shared-component/SearchFilter";
import Loading from "../../shared/Loading";
import DeleteDialog from "../../shared/DeleteDialog";
import ColumnVisibilityButton from "../../shared/ColumnVisibilityButton";
import TagManagement from "../../service/Tag";
import UpdateTagsDialog from "./UpdateTagsDialog";
const TagsTable = () => {
  const dispatch = useDispatch();
  const reloadPage = useSelector((state) => state.reload.reloadPage);
  const filter = useSelector((state) => state.project.filter);
  const [tags, setTags] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagId, setTagId] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    tag: true,
    options: true,
  });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await TagManagement.getTagList();
        setTags(result?.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        dispatch(setReloadPage(false));
      }
    };

    fetchData();
  }, [reloadPage, filter]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(tags.map((tag) => tag.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete the selected tags?")) {
      return;
    }
    // Delete multiple tags
    Promise.all(selectedIds.map((id) => TagManagement.deleteTag(id)))
      .then(() => {
        setTags(tags.filter((tag) => !selectedIds.includes(tag.id)));
        setSelectedIds([]);
        toast.success("Selected tags deleted successfully.");
        dispatch(setReloadPage(true)); // Reload page to fetch updated tags list
      })
      .catch((err) => {
        console.error("Error deleting tags:", err);
        toast.error("Failed to delete selected tags.");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (tag) => {
    setSelectedTag(tag);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTag(null);
  };
  const handleClickOpen = (id) => {
    setTagId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = (id) => {
    TagManagement.deleteTag(id)
      .then(() => {
        dispatch(setReloadPage(true));
        handleClose();
        toast.success("Tag Delete Successfully");
      })
      .catch((error) => {
        console.error("Error deleting the Tag:", error);
      });
  };

  return (
    <div>
      <Paper>
        <div className="flex mt-10 p-1 mb-3 justify-between flex-nowrap">
          <div className="flex h-10 text-nowrap">
            <Button
              variant="contained"
              onClick={handleDeleteSelected}
              disabled={selectedIds?.length === 0}
              sx={{
                marginRight: "10px",
                backgroundColor: "white",
                border: "1px solid #FF474C",
                color: "#FF474C",
                "&:hover": {
                  backgroundColor: "#FF474C",
                  color: "white",
                },
              }}
            >
              <RiDeleteBinLine className="mr-1 text-lg" /> Delete Selected
            </Button>
          </div>
          <div className="flex">
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <ColumnVisibilityButton
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </div>
        </div>
        <TableContainer>
          <Table
            sx={{
              border: "1px solid gray",
              "& th, & td": { border: "1px solid #E0E5E5", color: "gray" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedIds?.length > 0 &&
                      selectedIds?.length < tags.length
                    }
                    checked={
                      tags?.length > 0 && selectedIds.length === tags.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns?.id && <TableCell>ID</TableCell>}
                {visibleColumns?.title && <TableCell>TITLE</TableCell>}
                {visibleColumns?.tag && <TableCell>PREVIEW</TableCell>}
                {visibleColumns?.options && <TableCell>OPTIONS</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {tags
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((tag, index) => (
                  <TableRow key={tag?._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds?.includes(tag?._id)}
                        onChange={() => handleSelect(tag?._id)}
                      />
                    </TableCell>
                    {visibleColumns?.id && <TableCell>{index + 1}</TableCell>}
                    {visibleColumns?.title && (
                      <TableCell>
                        <div className="flex">
                          <p className="mr-3">{tag?.title}</p>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns?.tag && (
                      <TableCell>
                        <p
                          style={{ backgroundColor: tag.txColor }}
                          className={` text-white inline p-1 px-2 rounded uppercase text-xs`}
                        >
                          {tag?.title}
                        </p>
                      </TableCell>
                    )}

                    {visibleColumns?.options && (
                      <TableCell>
                        <div className="flex justify-evenly">
                          <FaRegEdit
                            style={{
                              color: "#3f51b5",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                            onClick={() => handleOpenDialog(tag)}
                          />
                          <RiDeleteBinLine
                            onClick={() => handleClickOpen(tag?._id)}
                            style={{
                              color: "tomato",
                              fontSize: "16px",
                              marginRight: "20px",
                            }}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tags?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        id={tagId}
      />
      <UpdateTagsDialog
        open={dialogOpen}
        tag={selectedTag}
        onClose={handleCloseDialog}
      />
    </div>
  );
};
TagsTable.propTypes = {
  API: PropTypes.func.isRequired,
};
export default TagsTable;
