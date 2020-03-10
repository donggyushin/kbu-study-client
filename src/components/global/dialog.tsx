import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IProps {
    title: string
    message: string
    callback: () => void
}

const AlertDialog: React.FC<IProps> = ({
    title,
    message,
    callback
}) => {
    const [open, setOpen] = React.useState(true);


    // const handleClose = () => {
    //     setOpen(false);
    // };

    return (
        <div>
            <Dialog
                open={open}
                onClose={callback}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={callback} color="primary" autoFocus>
                        네
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AlertDialog