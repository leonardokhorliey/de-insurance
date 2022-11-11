import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'
import Layout from './Layout';
// import { useMoralisFile } from 'react-moralis';
import uploadToIpfs from '../helpers/moralis';

const PackageDetail = ({packages, address, balance, connectWallet, signedIn, setUploadedDocsURI}) => {

    const {packageType} = useParams();

    const [images, setImages] = useState([]);
    const [valuation, setValuation] = useState()
    const [ipfsObject, setipfsObject] = useState({
        name: "",
        identity: "",
        image: "",
        supportingDocs: [
            {
                id: 1,
                description: "",
                image: ""
            }
        ]
    });

    console.log(packageType);

    const k = {
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    }

    const [pkg, setPkg] = useState({
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    });

    const [lastDocId, setLastDocId] = useState(1);
    const [docs, setDocs] = useState([{
        id: 1,
        description: ""
    }])

    useEffect(() => {
        // console.log(packageType);
        // console.log(pkg);
        // console.log(packages);
        // console.log(packages.filter(pkg => pkg.id == packageType))
        setPkg(packages.filter(pkg => pkg.id == packageType)[0]);
    }, [packages])

    const updateDocumentDescription = (id, description) => {

        setDocs(prev => {

            // prev.map(item => {
            //     if (item.id === id)
            // }) 
            console.log(prev);
            for (let i= 0; i< prev.length; i++) {
                if (prev[i].id === id) prev[i].description = description
            }
            return prev;
        })
    }

    const addNewDocument = () => {

        const newId = lastDocId + 1;

        setDocs(prev => [
            ...prev, {
                id: newId,
                description: ""
            }
        ])

        setLastDocId(newId);
    }

    const removeDocument = (id) => {
        if (docs.length === 1) return;

        setDocs(prev => prev.filter(item => item.id !== id))
        setImages(prev => prev.filter(item => item.id !== id))
    }

    const uploadImagestoIpfs = async () => {

        let files = [];

        images.forEach(img => {
            let content;
            content.path= `${img.file.name}.json`;
            content.content = img.file;
            files.push(content);
        }) 

        

        const data = await uploadToIpfs(files);
        return data;
    }

    const uploadDocsURI = async () => {
        const uploadedImgs = await uploadImagestoIpfs();
        
        let data;
        uploadedImgs.forEach(async (item, idx) => {
            if (idx === 0) setipfsObject(prev => {return {...prev, image: uploadedImgs[0].path}});

            setipfsObject(prev => {
                prev.supportingDocs[idx - 1].image = uploadedImgs[0].path

                return prev;
            });

            if (idx === uploadedImgs.length - 1) data = await uploadToIpfs([ipfsObject]);

            setUploadedDocsURI(data[0].path, packageType, valuation);

        })

    }
    

    return (
        <Layout children =
        {<div id="package-detail">
        <section id="detail-area">
            {!pkg ? <div>
                <img src={k.img} alt={`${k.name} pic`}/>
                <div>
                    <h1>
                        {k.name}
                    </h1>

                    <p>
                        {k.description}
                    </p>
                </div>
            </div>: <div>
                <img src={pkg.img} alt={`${pkg.name} pic`}/>
                <div class="pkg-description">
                    <h1>
                        {pkg.name}
                    </h1>

                    <p>
                        {pkg.description}
                    </p>
                </div>
            </div>}
        </section>
        <section id="package-enroll-area">

            <div>
                <h2>
                    Enroll for this package today
                </h2>
                <div class="register-form">
                    <div class="form-area">
                        <label>Enter Item Name</label>
                        <input type="text" value={ipfsObject.name} onChange={(e) => setipfsObject(prev => {return {...prev, name: e.target.value}})}/>
                    </div>
                    
                    <div class="form-area">
                        <label>Enter a unique identity info</label>
                        <input type="text" value={ipfsObject.identity} onChange={(e) => setipfsObject(prev => {return {...prev, identity: e.target.value}})}/>
                    </div>

                    <div class="form-area">
                        <label>
                            Upload an image of item
                        </label>
                        <input type="file" name="image"  onChange={(e) => {
								setImages(prev => [...prev, {id: -1, name: e.target.files[0].name, file: e.target.files[0]}]);
							}}/>
                    </div>
                    <div class="form-area">
                        <label>
                            Propose Valuation in USDT
                        </label>
                        <input type="text" value={valuation} onChange={(e) => {
								setValuation(e.target.value);
							}}/>
                    </div>

                </div>
                <div class="register-form">
                        <h3>Documents</h3>
                        {
                            docs.map((ele, idx) => 
                                <div class= "doc-upload" key={idx}>
                                    <div class="doc-identity">
                                        <h3>Document</h3>
                                        <button onClick={() => removeDocument(ele.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                    

                                    <div class="form-area">
                                        <label>Enter file description</label>
                                        <input type="text" value={docs.filter(doc => doc.id === ele.id)[0].description} 
                                        onChange={(e) => updateDocumentDescription(ele.id, e.target.value)}/>
                                    </div>
                                    
                                    <div class="form-area"> 
                                        <label>Upload file</label>
                                        <input type="file" 
                                        onChange={(e) => {
                                            setImages(prev => [...prev, {id: ele.id, name: e.target.files[0].name, file: e.target.files[0]}]);
                                        }}/>
                                    </div>

                                    
                                </div>
                            )
                        }

                        <button style={{width: '300px'}} onChange={() => addNewDocument()}>
                            Add another Document
                        </button>
                </div>

                <button style={{width: '400px', marginTop: '100px'}} onClick= {() => uploadDocsURI()}>
                    Register for package
                </button>
            </div>

        </section>
    </div>} address={address} balance={balance} connectWallet={connectWallet} signedIn={signedIn} />
        
    )

}


export default PackageDetail;